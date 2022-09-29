import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ErrorMessage } from "@enum";
import { Utils } from "@utils";
import { UserService } from "../../module/user/service/user.service";
import { CookieName } from "../../../dist/common/enum/system.enum";

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt") {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const refreshToken = JwtRefreshGuard.getRefreshTokenFromCookie(request);
      const verifyRefresh = await this.jwtService.verifyAsync(
        refreshToken,
        this.getRefreshTokenOptions
      );
      const user = await this.userService.findOne({
        id: verifyRefresh["userId"],
      });

      return (request["user"] = Utils.exclude(user));
    } catch (error) {
      request.res.clearCookie(CookieName.refresh_token, { path: "/" });
      throw new HttpException(
        ErrorMessage.invalid_access_token,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  private static getRefreshTokenFromCookie(request: Request): string {
    return request.cookies[CookieName.refresh_token];
  }

  private get getRefreshTokenOptions() {
    return {
      secret: this.configService.get<string>("secure.jwt_refresh_secret"),
    };
  }
}
