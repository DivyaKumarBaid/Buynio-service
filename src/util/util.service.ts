import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { APIResponse } from "src/types/api.types";

@Injectable()
export class UtilService {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async hashData(body: string) {
    return await argon.hash(body);
  }

  async getToken(userId: number, email: string) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.config.get("RT_SECRET"),
        expiresIn: 60 * 60 * 24 * 7,

        // expiresIn: 10,
      }
    );

    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.config.get("AT_SECRET"),
        expiresIn: 60 * 20,
      }
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateOtp() {
    const minm = 1000;
    const maxm = 9999;
    return (Math.floor(Math.random() * (maxm - minm + 1)) + minm).toString();
  }

  async getPayload(access_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: this.config.get("AT_SECRET"),
      });
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  createSuccessResponse(response: Record<any, any>): APIResponse {
    return { error: false, response };
  }

  createErrorResponse(
    developerMessage: string,
    displayMessage: string
  ): APIResponse {
    return { error: true, developerMessage, displayMessage };
  }
}
