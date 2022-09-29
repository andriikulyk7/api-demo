import { IFullProfile } from "./user.interface";

export interface IDefaultResponse {
  message: string;
}

export interface ISignInResponse extends IFullProfile {
  accessToken: string;
}
