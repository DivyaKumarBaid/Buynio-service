import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { APIResponse } from "src/types/api.types";
import {
  Instagram_Jwt_Payload,
  Unverified_User_Type,
} from "src/types/user.types";
import { UtilService } from "src/util/util.service";
import {
  OTPAuthDto,
  OtpPasswordDto,
  PasswordAuthDto,
  SigninAuthDto,
  SigninThirdPartyAuthDto,
  SignupAuthDto,
} from "./dto";

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prismaService: PrismaService,
    private utility: UtilService,
    private mailer: MailService,
    private config: ConfigService
  ) {
    this.googleClient = new OAuth2Client({
      clientId: this.config.get("GOOGLE_CLIENT_ID"),
    });
  }

  private async fetchUserWithMinimalFields(email: string) {
    return this.prismaService.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        hashRT: true,
        brand: true,
      },
    });
  }

  private async fetchUnverifiedUser(email: string) {
    return this.prismaService.unverified_Users.findUnique({ where: { email } });
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.utility.hashData(rt);
    await this.prismaService.users.update({
      where: { id: userId },
      data: { hashRT: hash },
    });
  }

  async updateOtp(userId: number): Promise<APIResponse> {
    try {
      const otp = String(await this.utility.generateOtp());
      const hashedOtp = await this.utility.hashData(otp);
      const user = await this.prismaService.unverified_Users.update({
        where: { id: userId },
        data: { otp: hashedOtp },
      });
      return this.utility.createSuccessResponse({ ...user, otp });
    } catch {
      return this.utility.createErrorResponse(
        "Error updating OTP",
        "Failed to update OTP"
      );
    }
  }

  async signupLocal(dto: SignupAuthDto) {
    try {
      const preExist = await this.fetchUserWithMinimalFields(dto.email);
      if (preExist)
        return this.utility.createErrorResponse(
          "User already exists",
          "Account with this email already exists"
        );

      const reSend = await this.fetchUnverifiedUser(dto.email);
      let user: Unverified_User_Type;
      let otp: string;

      if (reSend) {
        const result = await this.updateOtp(reSend.id);
        if (result.error) return result;
        if (result.error == false) {
          user = result.response as Unverified_User_Type;
          otp = user.otp;
        }
      } else {
        const hash = await this.utility.hashData(dto.password);
        otp = String(await this.utility.generateOtp());
        const hashedOtp = await this.utility.hashData(otp);
        user = await this.prismaService.unverified_Users.create({
          data: {
            email: dto.email,
            password: hash,
            username: dto.username,
            otp: hashedOtp,
          },
        });
      }

      delete user.password;
      delete user.otp;
      await this.mailer.sendUserConfirmation(user.email, user.username, otp);

      return this.utility.createSuccessResponse(user);
    } catch {
      return this.utility.createErrorResponse(
        "Signup failed",
        "Unable to register user"
      );
    }
  }

  async verifyLocal(dto: OTPAuthDto) {
    try {
      const user = await this.prismaService.unverified_Users.findUnique({
        where: { id: +dto.id },
      });
      if (!user)
        return this.utility.createErrorResponse(
          "User not found",
          "Invalid user ID"
        );

      if (!(await argon.verify(user.otp, dto.otp)))
        return this.utility.createErrorResponse(
          "Invalid OTP",
          "The OTP is incorrect"
        );

      delete user.otp;
      delete user.id;
      const newUser = await this.prismaService.users.create({
        data: { ...user },
      });
      await this.prismaService.unverified_Users.delete({
        where: { email: user.email },
      });

      return this.utility.createSuccessResponse(newUser);
    } catch {
      return this.utility.createErrorResponse(
        "Verification failed",
        "Unable to verify user"
      );
    }
  }

  async changePassword(dto: PasswordAuthDto) {
    try {
      await this.prismaService.passwordOtp.delete({
        where: { user_mail: dto.email },
      });

      const user = await this.fetchUserWithMinimalFields(dto.email);
      if (!user)
        return this.utility.createErrorResponse(
          "User not found",
          "Invalid email address"
        );

      const otp = String(await this.utility.generateOtp());
      await this.mailer.sendUserConfirmation(user.email, user.username, otp);
      await this.prismaService.passwordOtp.create({
        data: {
          user_mail: dto.email,
          hashOtp: await this.utility.hashData(otp),
        },
      });

      return this.utility.createSuccessResponse({ message: "Email sent" });
    } catch {
      return this.utility.createErrorResponse(
        "Change password failed",
        "Unable to process request"
      );
    }
  }

  async verifyPasswordChange(dto: OtpPasswordDto) {
    try {
      const passOtp = await this.prismaService.passwordOtp.findUnique({
        where: { user_mail: dto.email },
      });
      if (!passOtp || !(await argon.verify(passOtp.hashOtp, dto.otp)))
        return this.utility.createErrorResponse("Unauthorized", "Invalid OTP");

      await this.prismaService.users.update({
        where: { email: dto.email },
        data: { password: await argon.hash(dto.password) },
      });
      await this.prismaService.passwordOtp.delete({
        where: { id: passOtp.id },
      });

      return this.utility.createSuccessResponse({
        message: "Password updated successfully",
      });
    } catch {
      return this.utility.createErrorResponse(
        "Verification failed",
        "Unable to verify OTP"
      );
    }
  }

  async localLogin(dto: SigninAuthDto) {
    try {
      const user = await this.fetchUserWithMinimalFields(dto.email);
      if (!user || !(await argon.verify(user.password, dto.password)))
        return this.utility.createErrorResponse(
          "Forbidden",
          "Invalid credentials"
        );

      const tokens = await this.utility.getToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      delete user.hashRT;
      delete user.password;

      return this.utility.createSuccessResponse({ ...tokens, ...user });
    } catch {
      return this.utility.createErrorResponse(
        "Login failed",
        "Unable to login user"
      );
    }
  }

  async googleLogin(dto: SigninThirdPartyAuthDto) {
    try {
      const decodedToken = (
        await this.googleClient.verifyIdToken({
          idToken: dto.token,
          audience: this.config.get("GOOGLE_CLIENT_ID"),
        })
      ).getPayload();

      let user = await this.fetchUserWithMinimalFields(decodedToken.email);

      if (!user) {
        const newUser = {
          email: decodedToken.email,
          username: decodedToken.name,
          signInMethod: "google.com",
          password: await this.utility.hashData(dto.token),
        };
        user = await this.prismaService.users.create({
          data: newUser,
          include: { brand: true },
        });
      }

      const tokens = await this.utility.getToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      delete user.hashRT;
      delete user.password;

      return this.utility.createSuccessResponse({ ...tokens, ...user });
    } catch {
      return this.utility.createErrorResponse(
        "Google sign-in failed",
        "Unable to sign in with Google"
      );
    }
  }

  async instagramLogin(dto: SigninThirdPartyAuthDto) {
    try {
      const decodedToken = jwt.verify(
        dto.token,
        this.config.get("INSTAGRAM_AUTH_TOKEN_SECRET")
      ) as Instagram_Jwt_Payload;

      let user = await this.fetchUserWithMinimalFields(
        decodedToken.data.username
      );

      if (!user) {
        const newUser = {
          email: decodedToken.data.username,
          username: decodedToken.data.name,
          signInMethod: "instagram.com",
          password: await this.utility.hashData(dto.token),
          isInstagramLinked: true,
          instagramAccessToken: jwt.sign(
            decodedToken.data.access_token,
            this.config.get("INSTAGRAM_AUTH_TOKEN_SECRET")
          ),
          instagramId: decodedToken.data.user_id.toString(),
        };
        user = await this.prismaService.users.create({
          data: newUser,
          include: { brand: true },
        });
      }

      const tokens = await this.utility.getToken(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      delete user.hashRT;
      delete user.password;

      return this.utility.createSuccessResponse({ ...tokens, ...user });
    } catch {
      return this.utility.createErrorResponse(
        "Instagram sign-in failed",
        "Unable to sign in with Instagram"
      );
    }
  }

  async logout(id: number) {
    try {
      await this.prismaService.users.updateMany({
        where: { id, hashRT: { not: null } },
        data: { hashRT: null },
      });
      return this.utility.createSuccessResponse({
        message: "Logged out successfully",
      });
    } catch {
      return this.utility.createErrorResponse(
        "Logout failed",
        "Unable to logout user"
      );
    }
  }

  async refreshToken(id: number, rt: string) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id },
        select: { hashRT: true, email: true },
      });
      if (!user || !(await argon.verify(user.hashRT, rt)))
        return this.utility.createErrorResponse(
          "Unauthorized",
          "Invalid refresh token"
        );

      const tokens = await this.utility.getToken(id, user.email);
      await this.updateRtHash(id, tokens.refresh_token);
      return this.utility.createSuccessResponse(tokens);
    } catch {
      return this.utility.createErrorResponse(
        "Token refresh failed",
        "Unable to refresh token"
      );
    }
  }

  async getPayload(access_token: string) {
    try {
      return this.utility.createSuccessResponse(
        await this.utility.getPayload(access_token)
      );
    } catch {
      return this.utility.createErrorResponse(
        "Invalid token",
        "Unable to decode token"
      );
    }
  }
}
