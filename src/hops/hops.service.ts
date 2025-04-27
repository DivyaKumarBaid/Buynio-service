import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { initiateHop } from "src/lib/InitiateHop";
import { pageIndex } from "src/lib/constants";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { APIResponse } from "src/types/api.types";
import { UtilService } from "src/util/util.service";
import { brandCreationDto, savedHopCreationDto } from "./dto";

@Injectable()
export class HopsService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  async checkLink(link: string): Promise<APIResponse> {
    if (link?.trim() == "") {
      return this.utility.createErrorResponse(
        "Link query parameter is required",
        "Unable to fetch link. Please try again later."
      );
    }
    try {
      const brand = await this.prismaService.brand.findUnique({
        where: { link },
        select: { id: true },
      });
      return this.utility.createSuccessResponse({ exists: !!brand });
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Database query failed",
        "Unable to fetch hops. Please try again later."
      );
    }
  }

  async getAllHops(ownerId: number, pg: string): Promise<APIResponse> {
    try {
      const page = Number(pg);
      const count = await this.prismaService.savedWeb.count({
        where: { ownerId },
      });
      const hops = await this.prismaService.savedWeb.findMany({
        where: { ownerId },
        take: 15,
        skip: page * pageIndex,
      });
      const releasedHop = await this.prismaService.releasedWeb.findFirst({
        where: { ownerId },
      });
      return this.utility.createSuccessResponse({
        hops,
        releasedHop,
        meta: {
          count,
          currentPage: page,
          totalPages: Math.ceil(count / pageIndex),
        },
      });
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to fetch hops",
        "Unable to fetch hops. Please try again later."
      );
    }
  }

  async getAllPublishedHops(pg: string): Promise<APIResponse> {
    try {
      const page = Number(pg);
      const count = await this.prismaService.releasedWeb.count();
      const releasedWebs = await this.prismaService.releasedWeb.findMany({
        take: 15,
        skip: page * pageIndex,
      });
      return this.utility.createSuccessResponse({
        hops: releasedWebs,
        meta: {
          count,
          currentPage: page,
          totalPages: Math.ceil(count / pageIndex),
        },
      });
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to fetch published hops",
        "Unable to fetch published hops. Please try again later."
      );
    }
  }

  async getPublishedHop(link: string): Promise<APIResponse> {
    try {
      const brand = await this.prismaService.brand.findUnique({
        where: { link },
      });
      if (!brand) {
        return this.utility.createErrorResponse(
          "Brand not found",
          "The requested brand does not exist."
        );
      }
      const releasedWeb = await this.prismaService.releasedWeb.findUnique({
        where: { brandId: brand.id },
      });
      return this.utility.createSuccessResponse(releasedWeb || {});
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to fetch published hop",
        "Unable to fetch the published hop. Please try again later."
      );
    }
  }

  async createHop(
    ownerId: number,
    dto: brandCreationDto
  ): Promise<APIResponse> {
    try {
      const hop = await this.prismaService.brand.create({
        data: {
          ...dto,
          owner: { connect: { id: ownerId } },
        },
      });
      const savedHop = await this.createSavedHop(ownerId, {
        blueprint: initiateHop(dto),
        name: "Untitled",
        products: [],
        publish: false,
      });
      if (savedHop.error == false) {
        return this.utility.createSuccessResponse({
          ...hop,
          savedHop: savedHop.response,
        });
      }
      return this.utility.createErrorResponse(
        "Failed to create hop",
        "Unable to create hop. Please try again later."
      );
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to create hop",
        "Unable to create hop. Please try again later."
      );
    }
  }

  async getAllSavedHops(ownerId: number, pg: string): Promise<APIResponse> {
    return this.getAllHops(ownerId, pg);
  }

  async getSavedHop(ownerId: number, savedHopId: string): Promise<APIResponse> {
    try {
      const savedHop = await this.prismaService.savedWeb.findUniqueOrThrow({
        where: { id: Number(savedHopId), ownerId },
      });
      return this.utility.createSuccessResponse(savedHop);
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to fetch saved hop",
        "Unable to fetch the saved hop. Please try again later."
      );
    }
  }

  async createSavedHop(
    id: number,
    dto: savedHopCreationDto
  ): Promise<APIResponse> {
    try {
      const brand = await this.prismaService.brand.findUnique({
        where: { ownerId: id },
      });
      const brandId = brand.id;
      delete brand.id;
      const hop = await this.prismaService.savedWeb.create({
        data: {
          blueprint: dto.blueprint || initiateHop(brand),
          name: dto.name || "Untitled",
          owner: { connect: { id } },
        },
      });

      await this.updatePublishedHops(dto, id, brandId, brand);

      if (dto.products?.length) {
        const productPromises = dto.products.map((product) =>
          this.prismaService.products.create({
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
          })
        );
        await Promise.all(productPromises);
      }
      return this.utility.createSuccessResponse(hop);
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to create saved hop",
        "Unable to create the saved hop. Please try again later."
      );
    }
  }

  async saveHop(
    ownerId: number,
    savedHopId: string,
    dto: savedHopCreationDto
  ): Promise<APIResponse> {
    try {
      const brand = await this.prismaService.brand.findFirst({
        where: { ownerId },
      });
      const updateData: savedHopCreationDto = JSON.parse(JSON.stringify(dto)); //shallowCopy
      delete updateData.products;
      delete updateData.publish;

      const hop = await this.prismaService.savedWeb.update({
        where: { id: Number(savedHopId), ownerId },
        data: updateData,
      });
      await this.updatePublishedHops(dto, ownerId, brand.id, brand);
      await this.prismaService.products.deleteMany({
        where: { hopId: Number(savedHopId) },
      });

      if (dto.products?.length) {
        const productPromises = dto.products.map((product) =>
          this.prismaService.products.create({
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
          })
        );
        await Promise.all(productPromises);
      }

      return this.utility.createSuccessResponse(hop);
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to save hop",
        "Unable to save the hop. Please try again later."
      );
    }
  }

  async updatePublishedHops(
    dto: savedHopCreationDto,
    ownerId: number,
    brandId: number,
    brand: brandCreationDto
  ): Promise<APIResponse> {
    try {
      if (dto.publish) {
        const existingPublished =
          await this.prismaService.releasedWeb.findFirst({
            where: { ownerId, brandId },
          });

        if (existingPublished) {
          await this.prismaService.releasedWeb.update({
            where: { id: existingPublished.id },
            data: {
              blueprint: dto.blueprint || initiateHop(brand),
              name: dto.name || "Untitled",
              owner: { connect: { id: ownerId } },
              brand: { connect: { id: brandId } },
            },
          });
        } else {
          await this.prismaService.releasedWeb.create({
            data: {
              blueprint: dto.blueprint || initiateHop(brand),
              name: dto.name || "Untitled",
              owner: { connect: { id: ownerId } },
              brand: { connect: { id: brandId } },
            },
          });
        }
      }
      return this.utility.createSuccessResponse({
        message: "Published hops updated successfully",
      });
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to update published hops",
        "Unable to update published hops. Please try again later."
      );
    }
  }
}
