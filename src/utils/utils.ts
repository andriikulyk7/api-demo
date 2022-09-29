import { HttpUtils as http } from "./http.utils";
import { v4 as UuIdv4 } from "uuid";
import * as crypto from "crypto";

export class Utils {
  public static generateUUId() {
    return UuIdv4();
  }

  public static isEmpty<T>(object: T): boolean {
    const isEmptyByType = {
      array: (arr: Array<T>) => arr.length,
      object: (obj: T) => Object.keys(obj).length,
    };

    const type = typeof object;

    const fn = isEmptyByType[type];

    return fn(object) === 0;
  }

  public static exclude(object) {
    const { createdAt, updatedAt, userId, password, ...rest } = object;

    return rest;
  }

  public static get http() {
    return http;
  }

  public static generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  public static hashString(token: string): string {
    return crypto.createHash("SHA256").update(token).digest("hex");
  }
}
