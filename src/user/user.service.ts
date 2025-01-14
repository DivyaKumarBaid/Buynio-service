import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { APIResponse } from "src/types/api.types";
import { UtilService } from "src/util/util.service";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {}

  async getUser(id: number): Promise<APIResponse> {
    try {
      const user = await this.prismaService.users.findUniqueOrThrow({
        where: { id },
        include: { brand: true },
      });
      return this.utility.createSuccessResponse(user);
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to fetch user",
        "Unable to retrieve user details. Please try again later."
      );
    }
  }

  async toggleOnBoarding(id: number): Promise<APIResponse> {
    try {
      const user = await this.prismaService.users.update({
        where: { id },
        data: { onBoarded: true },
      });
      delete user.hashRT;
      delete user.password;
      return this.utility.createSuccessResponse(user);
    } catch (error) {
      return this.utility.createErrorResponse(
        error.message || "Failed to toggle onboarding",
        "Unable to toggle onboarding status. Please try again later."
      );
    }
  }
}
