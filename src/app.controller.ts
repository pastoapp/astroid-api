import {
  Controller,
  Get,
  Query,
  Logger,
  Post,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { AppService } from "./app.service";
import { User } from "./users/entities/user.entity";

export type JwtUserRequest = Request & { user: { uid: string } };

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get("/")
  index(): string {
    return this.appService.landingPage();
  }

  @Get("/get")
  async getKeys(@Query() query): Promise<string> {
    const { key } = query;
    return await this.appService.getKey(key);
  }

  @Post("/auth/login")
  async login(@Req() req) {
    this.logger.debug("login is called");
    const user: User = req.user;

    // return this.authService.login(user);
  }

  @Get("/auth/profile")
  getProfile(@Req() req: JwtUserRequest) {
    return req.user;
  }
}
