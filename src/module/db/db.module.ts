import { Module } from "@nestjs/common";
import { Repository } from "typeorm";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DBService } from "./service/db.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<TypeOrmModuleAsyncOptions>("db"),
      inject: [ConfigService],
    }),
  ],
  providers: [DBService, Repository],
  exports: [DBService],
})
export class DBModule {}
