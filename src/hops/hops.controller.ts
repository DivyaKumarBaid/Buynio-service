import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { HopsService } from "./hops.service";
import { AuthGuard } from "@nestjs/passport";
import { brandCreationDto, savedHopCreationDto } from "./dto";
import { Request } from "express";

@Controller("hop")
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
  async create(@Req() req: Request, @Body() dto: brandCreationDto) {
    const user = req.user;
    return await this.hopsService.createHop(user["sub"], dto);
  }

  // get all saved hop
  @UseGuards(AuthGuard("jwt"))
  @Get("saved/all")
  async getAllSavedHops(@Req() req: Request) {
    const user = req.user;
    return await this.hopsService.getAllSavedHops(user["sub"]);
  }

  // get single saved hop
  @UseGuards(AuthGuard("jwt"))
  @Get("savedHop/:id")
  async getSavedHop(@Req() req: Request, @Param("id") id: number) {
    const user = req.user;
    return await this.hopsService.getSavedHop(user["sub"], id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("savedHop/save/:id")
  async saveHop(
    @Req() req: Request,
    @Param("id") id: number,
    @Body() dto: savedHopCreationDto
  ) {
    const user = req.user;
    return await this.hopsService.saveHop(user["sub"], id, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("savedHop/create")
  async createSavedHop(@Req() req: Request, @Body() dto: savedHopCreationDto) {
    const user = req.user;
    return await this.hopsService.createSavedHop(user["sub"], dto);
  }
}
