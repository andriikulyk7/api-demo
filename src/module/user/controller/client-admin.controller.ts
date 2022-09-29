import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ClientAdminSignUpDto } from "@dto";
import { ClientAdminService } from "../service/client-admin.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("client-admin")
@ApiBearerAuth("Access token")
@ApiTags("Module: Client-Admin | Controller: Client-Admin")
export class ClientAdminController {
  constructor(private clientAdminService: ClientAdminService) {}

  @Post("sign-up")
  public async signUp(@Body() signUpDto: ClientAdminSignUpDto) {
    await this.clientAdminService.signUp(signUpDto);
    return HttpStatus.OK;
  }
}
