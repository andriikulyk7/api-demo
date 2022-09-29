import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "@decorator";
import { IUserRequest } from "@interface";
import { JwtAuthGuard } from "@guard";
import { UpdatePasswordDto } from "@dto";
import { ApiDocumentation } from "@doc";
import { UserService } from "../service/user.service";

@Controller("user")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("Access token")
@ApiTags("Module: User | Controller: User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch("secure/update")
  @ApiDocumentation({ controller: "user", path: "secure" })
  public secureUpdate(
    @User() user: IUserRequest,
    @Body() secure_dto: UpdatePasswordDto
  ) {
    return this.userService.updateSecure(user, secure_dto);
  }
}
