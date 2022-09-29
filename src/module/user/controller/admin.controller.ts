import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard, JwtAuthGuard } from "@guard";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateAdminDto,
  EvaluateClientAdminDto,
  InviteClientDto,
  QueryClientAdminDto,
} from "@dto";
import { AdminService } from "../service/admin.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("admin")
@ApiBearerAuth("Access token")
@ApiTags("Module: Admin | Controller: Admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post("create")
  @UseGuards(AuthGuard("unique"))
  public async createAdmin(@Body() admin_dto: CreateAdminDto) {
    await this.adminService.create(admin_dto);
    return HttpStatus.OK;
  }

  @Post("invite-client-admin")
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async inviteClientAdmin(@Body() { email }: InviteClientDto) {
    await this.adminService.inviteClientAdmin(email);
    return HttpStatus.OK;
  }

  @Post("evaluate-client-admin")
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async eveluateClientAdmin(@Body() approveDto: EvaluateClientAdminDto) {
    const currentStatus = await this.adminService.evaluateClientAdmin(
      approveDto
    );

    return {
      message: `User is now ${currentStatus}`,
    };
  }

  @Get("client-admins")
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async getClientAdmins(@Body() query: QueryClientAdminDto) {
    return this.adminService.getClientAdmins(query);
  }
}
