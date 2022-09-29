import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@entity";
import { DBService } from "../db/service/db.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { AuthenticationController } from "./controller/authentication.controller";
import { AuthenticationService } from "./service/authentication.service";
import { UserModule } from "../user/user.module";
import { UniqueTokenAuthStrategy } from "./strategy/unique-token.strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("secure.jwt_secret"),
        signOptions: {
          expiresIn: configService.get<string>("secure.jwt_expire"),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    DBService,
    UniqueTokenAuthStrategy,
  ],
})
export class AuthenticationModule {}
