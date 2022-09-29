import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Utils } from "@utils";
import { UserService } from "../../user/service/user.service";
import { ConfigService } from "@nestjs/config";
import { ErrorMessage } from "@enum";
import { IUserRequest } from "@interface";
import { AuthenticationService } from "../service/authentication.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private authenticationService: AuthenticationService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("secure.jwt_secret"),
    });
  }

  public async validate(payload: IUserRequest): Promise<IUserRequest> {
    // While development | full request: { id: userId, status: UserStatus.Active }
    const found_user = await this.userService.findOne({
      id: payload["userId"],
    });
    const canLogin = this.authenticationService.userCanLogin(found_user);

    if (!found_user || !canLogin) {
      throw new UnauthorizedException(ErrorMessage.invalid_access_token);
    }

    return Utils.exclude(found_user);
  }
}
