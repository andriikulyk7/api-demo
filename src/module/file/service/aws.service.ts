import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as aws from "aws-sdk";

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  public async upload(key: string, params) {
    const storage = this.awsStorage();

    return storage.upload(params).promise();
  }

  private awsStorage() {
    const awsConfig = this.getAwsConfig();

    return new aws.S3({
      accessKeyId: awsConfig["accessKeyId"],
      secretAccessKey: awsConfig["secretAccessKey"],
      region: awsConfig["region"],
    });
  }

  private getAwsConfig() {
    const accessKeyId = this.configService.get<string>("aws.accessKeyId");
    const secretAccessKey = this.configService.get<string>(
      "aws.secretAccessKey"
    );
    const region = this.configService.get<string>("aws.region");

    return { accessKeyId, secretAccessKey, region };
  }
}
