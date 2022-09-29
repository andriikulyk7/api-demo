import { Module } from "@nestjs/common";
import { FileService } from "./service/file.service";
import { AwsService } from "./service/aws.service";
import { FileController } from "./controller/file.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [FileService, AwsService],
  exports: [FileService, AwsService],
})
export class FileModule {}
