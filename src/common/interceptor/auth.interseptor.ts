import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ErrorMessage } from "@enum";
import { Utils } from "@utils";
import { UserService } from "../../module/user/service/user.service";

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const email = request.body["email"];

    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new HttpException(
        ErrorMessage.user_not_exists,
        HttpStatus.NOT_FOUND
      );
    }

    const refreshToken = this.jwtService.sign(
      { userId: user["id"] },
      this.refreshTokenOptions
    );

    response.cookie(refreshToken, Utils.http.cookieOptions);

    return next.handle();
  }

  private get refreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.configService.get<string>("secure.jwt_refresh_secret"),
      expiresIn: this.configService.get<string>("secure.jwt_refresh_expire"),
    };
  }
}
