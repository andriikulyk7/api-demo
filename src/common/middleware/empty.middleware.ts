import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Utils } from "@utils";

@Injectable()
export class IsEmptyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    const body = req["body"];

    if (Utils.isEmpty(body)) {
      throw new HttpException(
        "Invalid or empty body of the request.",
        HttpStatus.BAD_REQUEST
      );
    }

    return next();
  }
}
