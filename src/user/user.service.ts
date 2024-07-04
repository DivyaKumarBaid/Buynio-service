import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilService } from "src/util/util.service";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  async getUser(id: number) {
    try {
      return await this.prismaService.users.findUniqueOrThrow({
        where: {
          id,
        },
        include:{
          brand: true
        }
      });
    } catch (_) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async toggleOnBoarding(id: number) {
    try {
      const user = await this.prismaService.users.update({
        where: {
          id,
        },
        data: {
          onBoarded: true,
        },
      });
      delete user.hashRT;
      delete user.password;
      return user;
    } catch (_) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
