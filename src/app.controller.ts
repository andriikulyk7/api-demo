import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller("/")
@ApiTags("Common")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return {
      status: 200,
      message: "/",
    };
  }

  @Get("health")
  @HttpCode(204)
  healthCheck() {
    return this.appService.healthCheck();
  }
}
