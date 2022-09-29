import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticationService } from "../service/authentication.service";
import { CreateAdminDto, ResetPasswordDto, ResetPasswordIntentDto } from "@dto";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../../user/service/user.service";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ISocialLoginResponse } from "../../../common/interface/user.interface";

@Controller("auth")
@ApiTags("Module: Authentication")
export class AuthenticationController {
  private SOCIAL_COOKIE_LIFETIME = 1000 * 20;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  @Post("admin/sign-up")
  @UseGuards(AuthGuard("unique"))
  public signUpAdmin(@Body() admin_dto: CreateAdminDto) {
    return this.authService.adminSignUp(admin_dto);
  }

  @Get("linkedin/callback")
  @UseGuards(AuthGuard("linkedin"))
  public linkedInAuthCallback(
    @Req() req: Request & { user: ISocialLoginResponse },
    @Res() res: Response
  ) {
    return this.socialCallback(req, res);
  }

  @Post("password/reset-intent")
  public resetPasswordIntent(@Body() { email }: ResetPasswordIntentDto) {
    return this.userService.resetPasswordIntent(email);
  }

  @Post("password/reset")
  public resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.userService.resetPassword(token, password);
  }

  private async socialCallback(
    @Req() req: Request & { user: ISocialLoginResponse },
    @Res() res: Response
  ) {
    const { existingUser, signUpDto } = req.user;
    const webAppUrl = this.configService.get<string>("app.web_url");

    if (existingUser) {
      const signInResponse = await this.authService.socialSignIn(
        existingUser.email
      );
      res.cookie(`social`, JSON.stringify(signInResponse), {
        maxAge: this.SOCIAL_COOKIE_LIFETIME,
      });
      return res.redirect(`${webAppUrl}/sign-in`);
    } else {
      const signUpResponse = await this.authService.signUpSocial(signUpDto);
      res.cookie(`social`, JSON.stringify(signUpResponse), {
        maxAge: this.SOCIAL_COOKIE_LIFETIME,
      });
      return res.redirect(`${webAppUrl}/sign-in`);
    }
  }
}
