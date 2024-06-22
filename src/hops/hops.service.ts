import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { initiateHop } from "src/lib/InitiateHop";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilService } from "src/util/util.service";
import { brandCreationDto } from "./dto";

@Injectable()
export class HopsService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  async getAllHops(id: number) {
    const getOwner = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
      },
    });
    return getOwner.brand;
  }

  async createHop(id: number, dto: brandCreationDto) {
    try {
      const hop = await this.prismaService.brand.create({
        data: {
          ...dto,
          owner: {
            connect: { id },
          },
          blueprint: initiateHop(dto),
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
