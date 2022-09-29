import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Utils } from "@utils";
import { FileFolderEnum } from "@enum";
import { AwsService } from "./aws.service";

@Injectable()
export class FileService {
  constructor(
    private readonly awsService: AwsService,
    private readonly configService: ConfigService
  ) {}

  public async upload(key: string, file: any, folder: FileFolderEnum) {
    const { buffer, mimetype } = file;

    const params = this.makeAwsParams(key, folder, buffer, mimetype);

    return await this.awsService.upload(key, params);
  }

  private makeAwsParams(
    userId: string,
    folder: FileFolderEnum,
    body: Buffer,
    type: string
  ) {
    const uuid = Utils.generateUUId();
    const bucket = this.configService.get<string>("aws.bucket");

    return {
      Bucket: `${bucket}/${folder}/${userId}`,
      Key: uuid,
      Body: body,
      ContentType: type,
    };
  }
}
