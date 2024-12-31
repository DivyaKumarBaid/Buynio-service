import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilService } from "src/util/util.service";
import { brandCreationDto, savedHopCreationDto } from "./dto";
import { initiateHop } from "src/lib/InitiateHop";
import { pageIndex } from "src/lib/constants";

@Injectable()
export class HopsService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  // hop
  async getAllHops(id: number, pg: string) {
    const page = Number(pg);
    const count = await this.prismaService.savedWeb.count();
    const hops = await this.prismaService.savedWeb.findMany({
      where: {
        ownerId: id,
      },
      take: 15,
      skip: page * pageIndex,
    });
    return {
      hops,
      meta: {
        count,
        currentPage: pg,
        totalPages: count / pageIndex + (count % pageIndex ? 1 : 0),
      },
    };
  }

  // all published hop
  async getAllPublishedHops(id: number, pg: string) {
    const page = Number(pg);
    const count = await this.prismaService.savedWeb.count();
    const releasedWebs = await this.prismaService.releasedWeb.findMany({
      take: 15,
      skip: page * pageIndex,
    });
    return {
      hops: releasedWebs,
      meta: {
        count,
        currentPage: pg,
        totalPages: count / pageIndex + (count % pageIndex ? 1 : 0),
      },
    };
  }

  // single published hop
  async getPublishedHop(link: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: {
        link,
      },
    });
    if (brand) {
      const releasedWeb = await this.prismaService.releasedWeb.findUnique({
        where: {
          brandId: brand.id,
        },
      });
      return releasedWeb;
    }
  }

  async createHop(id: number, dto: brandCreationDto) {
    // try {
    const hop = await this.prismaService.brand.create({
      data: {
        ...dto,
        owner: {
          connect: { id },
        },
      },
    });
    const savedHop = await this.createSavedHop(id, {
      blueprint: initiateHop(dto),
      name: "Untitled",
      products: [],
      publish: false,
    });
    return { ...hop, savedHop };
  }

  // saved hops

  async getAllSavedHops(id: number, pg: string) {
    const page = Number(pg);
    const count = await this.prismaService.savedWeb.count();
    const hops = await this.prismaService.savedWeb.findMany({
      where: {
        ownerId: id,
      },
      take: 15,
      skip: page * pageIndex,
    });
    return {
      hops,
      meta: {
        count,
        currentPage: pg,
        totalPages: count / pageIndex + (count % pageIndex ? 1 : 0),
      },
    };
  }

  async getSavedHop(id: number, savedHopId: string) {
    try {
      const getSavedHop = await this.prismaService.savedWeb.findUniqueOrThrow({
        where: {
          id: Number(savedHopId),
          ownerId: id,
        },
      });
      return getSavedHop;
    } catch (e) {
      console.log(e);
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }

  async createSavedHop(id: number, dto: savedHopCreationDto) {
    try {
      const brand = await this.prismaService.brand.findUnique({
        where: { id },
      });
      const brandId = brand.id;
      delete brand.id;
      const hop = await this.prismaService.savedWeb.create({
        data: {
          blueprint: dto?.blueprint || initiateHop(brand),
          name: dto?.name || "Untitled",
          owner: {
            connect: { id },
          },
        },
      });

      await this.updatePublishedHops(dto, id, brandId, brand);

      const products = dto?.products.map((product) => {
        return this.prismaService.products.create({
          data: {
            ...product,
            owner: {
              connect: { id },
            },
            brand: {
              connect: { id: brandId },
            },
            hop: {
              connect: { id: hop.id },
            },
          },
        });
      });
      await Promise.all(products);
      return hop;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async saveHop(id: number, savedHopId: string, dto: savedHopCreationDto) {
    try {
      const brand = await this.prismaService.brand.findFirst({
        where: { ownerId: id },
      });
      const copyDto: savedHopCreationDto = JSON.parse(JSON.stringify(dto)); //shallowCopy
      delete copyDto.products;
      delete copyDto.publish;
      const hop = await this.prismaService.savedWeb.update({
        where: {
          id: Number(savedHopId),
          ownerId: id,
        },
        data: {
          ...copyDto,
        },
      });

      await this.updatePublishedHops(dto, id, id, brand);

      await this.prismaService.products.deleteMany({
        where: {
          hopId: Number(savedHopId),
        },
      });
      const products = dto?.products.map((product) => {
        return this.prismaService.products.create({
          data: {
            ...product,
            owner: {
              connect: { id: brand.ownerId },
            },
            brand: {
              connect: { id: brand.id },
            },
            hop: {
              connect: { id: Number(savedHopId) },
            },
          },
        });
      });
      await Promise.all(products);
      return hop;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // utility functions
  updatePublishedHops = async (
    dto: savedHopCreationDto,
    ownerId: number,
    brandId: number,
    brand: brandCreationDto
  ) => {
    try {
      if (dto.publish) {
        const isAlreadyPublished =
          await this.prismaService.releasedWeb.findFirst({
            where: {
              ownerId,
              brandId,
            },
          });
        if (isAlreadyPublished) {
          await this.prismaService.releasedWeb.delete({
            where: {
              ownerId,
              brandId,
            },
          });
        }
        await this.prismaService.releasedWeb.create({
          data: {
            blueprint: dto?.blueprint || initiateHop(brand),
            name: dto?.name || "Untitled",
            owner: {
              connect: { id: ownerId },
            },
            brand: {
              connect: { id: brandId },
            },
          },
        });
      }
    } catch (e) {
      console.log(e);
      throw HttpStatus.INTERNAL_SERVER_ERROR;
    }
  };
}
