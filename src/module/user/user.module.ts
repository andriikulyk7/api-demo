import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity, UserEntity } from "@entity";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { DBService } from "../db/service/db.service";
import { FileModule } from "../file/file.module";
import { MailService } from "../mail/mail.service";
import { ClientAdminEntity } from "../../common/entity/user/client-admin.entity";
import { AdminService } from "./service/admin.service";
import { AdminController } from "./controller/admin.controller";
import { ClientAdminService } from "./service/client-admin.service";
import { ClientAdminController } from "./controller/client-admin.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AdminEntity, ClientAdminEntity]),
    FileModule,
  ],
  controllers: [UserController, AdminController, ClientAdminController],
  providers: [
    UserService,
    AdminService,
    ClientAdminService,
    MailService,
    DBService,
  ],
  exports: [UserService, AdminService, ClientAdminService],
})
export class UserModule {}
