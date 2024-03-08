import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilService } from "src/util/util.service";
import { HopCreationDto } from "./dto";
import { connect } from "http2";

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
        hops: true,
      },
    });
    return getOwner.hops;
  }

  async createHop(id: number, dto: HopCreationDto) {
    try {
      const hop = await this.prismaService.hops.create({
        data: {
          ...dto,
          owner: {
            connect: { id },
          }
        },
      });
      return hop;
    } catch (_) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
