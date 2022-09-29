import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  public async healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
