import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UniqueTokenStrategy } from "passport-unique-token";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UniqueTokenAuthStrategy extends PassportStrategy(
  UniqueTokenStrategy,
  "unique"
) {
  private secret: string;
  private allow: boolean;

  constructor(configService: ConfigService) {
    const secret = configService.get<string>("secure.admin_signup_secret");
    const allowAdminSignUp =
      configService.get<string>("secure.admin_signup_allow") === "true";

    super({
      tokenQuery: "secret",
    });

    this.secret = secret;
    this.allow = allowAdminSignUp;
  }

  async validate(token, done) {
    if (this.allow && token === this.secret) {
      done(null, true);
    } else {
      done(
        new HttpException("Admin can not be created", HttpStatus.UNAUTHORIZED)
      );
    }
  }
}
