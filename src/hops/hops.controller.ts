import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { HopsService } from "./hops.service";
import { AuthGuard } from "@nestjs/passport";
import { HopCreationDto } from "./dto";
import { Request } from "express";

@Controller("hops")
export class HopsController {
  constructor(private hopsService: HopsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("all")
  async getAllHops(@Req() req: Request) {
    const user = req.user;
    return await this.hopsService.getAllHops(user["sub"]);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  async create(@Req() req: Request, @Body() dto: HopCreationDto) {
    const user = req.user;
    return await this.hopsService.createHop(user["sub"], dto);
  }
}
