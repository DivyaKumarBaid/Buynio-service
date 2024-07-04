import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilService } from "src/util/util.service";
import { brandCreationDto, savedHopCreationDto } from "./dto";
import { initiateHop } from "src/lib/InitiateHop";

@Injectable()
export class HopsService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  // hop
  async getAllHops(id: number) {
    const getOwner = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        ReleasedWeb: true,
      },
    });
    return getOwner.brand;
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
    });
    return { ...hop, savedHop };
  }

  // saved hops

  async getAllSavedHops(id: number) {
    const getSavedHops = await this.prismaService.savedWeb.findMany({
      where: {
        ownerId: id,
      },
    });
    return getSavedHops;
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
      const hop = await this.prismaService.savedWeb.update({
        where: {
          id: Number(savedHopId),
          ownerId: id,
        },
        data: {
          ...dto,
        },
      });
      return hop;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
