import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import {Request} from 'express'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("")
    async getAllHops(@Req() req: Request) {
      const user = req.user;
      return await this.userService.getUser(user["sub"]);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("/onBoarding")
    async toggleOnBoarding(@Req() req: Request) {
      const user = req.user;
      return await this.userService.toggleOnBoarding(user["sub"]);
    }
}
