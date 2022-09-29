import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as CookieParser from "cookie-parser";
import {
  AppConfig,
  AWSConfig,
  DBConfig,
  GoogleConfig,
  JoiSchema,
  LinkedInConfig,
  MailChimpConfig,
  SecureConfig,
} from "@config";
import { JsonBodyMiddleware, RawBodyMiddleware } from "@middleware";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DBModule } from "./module/db/db.module";
import { AuthenticationModule } from "./module/authentication/authentication.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AppConfig,
        DBConfig,
        SecureConfig,
        AWSConfig,
        GoogleConfig,
        LinkedInConfig,
        MailChimpConfig,
      ],
      envFilePath: [
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
      ],
      validationSchema: JoiSchema,
    }),
    DBModule,
    AuthenticationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(CookieParser())
      .forRoutes("/")
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: "payment/webhook",
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware);
  }
}
