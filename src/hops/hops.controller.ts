import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { brandCreationDto, savedHopCreationDto } from "./dto";
import { HopsService } from "./hops.service";

@Controller("hop")
export class HopsController {
  constructor(private hopsService: HopsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("all")
  async getAllHops(@Req() req: Request, @Query("page") page?: string) {
    const user = req.user;
    return await this.hopsService.getAllHops(user["sub"], page || "0");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("all/published")
  async getAllPublishedHops(@Req() req: Request, @Query("page") page?: string) {
    const user = req.user;
    return await this.hopsService.getAllPublishedHops(user["sub"], page || "0");
  }

  @Get("published/:link")
  async getPublishedHop(@Param("link") link: string) {
    return await this.hopsService.getPublishedHop(link);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  async create(@Req() req: Request, @Body() dto: brandCreationDto) {
    const user = req.user;
    return await this.hopsService.createHop(user["sub"], dto);
  }

  // get all saved hop
  @UseGuards(AuthGuard("jwt"))
  @Get("saved-hop/all")
  async getAllSavedHops(@Req() req: Request, @Query("page") page?: string) {
    const user = req.user;
    return await this.hopsService.getAllSavedHops(user["sub"], page || "0");
  }

  // get single saved hop
  @UseGuards(AuthGuard("jwt"))
  @Get("saved-hop/:id")
  async getSavedHop(@Req() req: Request, @Param("id") id: string) {
    const user = req.user;
    return await this.hopsService.getSavedHop(user["sub"], id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("saved-hop/save/:id")
  async saveHop(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: savedHopCreationDto
  ) {
    const user = req.user;
    return await this.hopsService.saveHop(user["sub"], id, dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("saved-hop/create")
  async createSavedHop(@Req() req: Request, @Body() dto: savedHopCreationDto) {
    const user = req.user;
    return await this.hopsService.createSavedHop(user["sub"], dto);
  }
}
