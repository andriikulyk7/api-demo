import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UserRole } from "@enum";

@Injectable()
export class AdminGuard extends AuthGuard("jwt") {
  public canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request["user"];

    return user?.["role"] === UserRole.admin;
  }
}

@Injectable()
export class ClientAdminGuard extends AuthGuard("jwt") {
  public canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request["user"];

    return user?.["role"] === UserRole.client_admin;
  }
}
