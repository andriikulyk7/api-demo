import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import {
  IDefaultResponse,
  IFullProfile,
  IProfileDto,
  IRequestParams,
  IUserPatch,
  IUserRequest,
  IUserSecure,
} from "@interface";
import { UserEntity } from "@entity";
import { ErrorMessage, FileFolderEnum, SuccessMessage, UserRole } from "@enum";
import { Utils } from "@utils";
import { DBService } from "../../db/service/db.service";
import { FileService } from "../../file/service/file.service";
import * as crypto from "crypto";
import { MailService } from "../../mail/mail.service";
import { AdminService } from "./admin.service";
import { ClientAdminService } from "./client-admin.service";

@Injectable()
export class UserService {
  private PASSWORD_TOKEN_EXPIRATION_TIME = 1000 * 15 * 60;

  constructor(
    private readonly db_service: DBService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => ClientAdminService))
    private readonly clientAdminService: ClientAdminService,
    private readonly fileService: FileService,
    private readonly mailService: MailService
  ) {}

  public async find(params: IRequestParams) {
    return this.userRepository.find({ where: params });
  }

  public async findOne(
    params: IRequestParams
  ): Promise<UserEntity> | undefined {
    return this.userRepository.findOne({ ...params });
  }

  public async getOne(params: IRequestParams): Promise<UserEntity> | undefined {
    const user = await this.userRepository.findOne({ ...params });

    if (!user) {
      throw new HttpException(
        ErrorMessage.user_not_exists,
        HttpStatus.NOT_FOUND
      );
    }

    const excludeUser = Utils.exclude(user);

    return {
      ...excludeUser,
      created: user["createdAt"],
    };
  }

  public async getUser(params: IRequestParams): Promise<IFullProfile> {
    const user = await this.getOne({ ...params });

    return {
      user,
    };
  }

  public create(userDto: IProfileDto): UserEntity {
    const { role, ...rest_user } = userDto;

    return UserEntity.create({ role, ...rest_user });
  }

  public async update(params: IRequestParams, userDto: IUserPatch) {
    const user = await this.getOne(params);

    const updateResponse = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity, { ...userDto })
      .where("id = :id", { id: user["id"] })
      .returning("*")
      .updateEntity(true)
      .execute();

    return updateResponse["raw"][0];
  }

  public async updateById(id: string, patchDto: IUserPatch) {
    const updateResponse = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity, { ...patchDto })
      .where("id = :id", { id: id })
      .returning("*")
      .updateEntity(true)
      .execute();

    return updateResponse["raw"][0];
  }

  private async getProfile(role: UserRole, userId: string) {
    switch (role) {
      case UserRole.admin:
        return this.adminService.getProfile(userId);
      case UserRole.client_admin:
        return this.clientAdminService.getProfile(userId);
    }
  }

  public async updateSecure(
    user: IUserRequest,
    secure_dto: IUserSecure
  ): Promise<IDefaultResponse> {
    const findUser = await this.findOne({ id: user["id"] });

    const { isValid, password } = await findUser.validateUpdatePassword(
      secure_dto
    );

    if (!isValid) {
      throw new HttpException(
        ErrorMessage.update_password,
        HttpStatus.BAD_REQUEST
      );
    }

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity, { password })
      .where({ id: user["id"] })
      .returning("*")
      .updateEntity(true)
      .execute();

    return {
      message: SuccessMessage.update_password,
    };
  }

  public async resetPasswordIntent(email: string) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new BadRequestException(ErrorMessage.profile_not_found);
    }

    const { firstName = "User" } = await this.getProfile(
      user.role as UserRole,
      user.id
    );

    const token = Utils.generateRandomToken();
    await this.mailService
      .sendPasswordResetMail(email, firstName, token)
      .catch((e) => {
        throw new HttpException(
          ErrorMessage.cant_send_email,
          HttpStatus.GATEWAY_TIMEOUT
        );
      });

    const hashedToken = Utils.hashString(token);
    const patchUser: IUserPatch = {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpirationDate: new Date(
        Date.now() + this.PASSWORD_TOKEN_EXPIRATION_TIME
      ),
    };
    await this.updateById(user.id, patchUser);

    return {
      message: "Email has been sent to the specified email",
    };
  }

  public async resetPassword(token: string, password: string) {
    const hashedToken = Utils.hashString(token);
    const NOW = new Date();
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpirationDate: MoreThan(NOW),
      },
    });

    if (!user) {
      throw new HttpException(
        ErrorMessage.user_not_exists,
        HttpStatus.BAD_REQUEST
      );
    }

    const hashedPassword = await UserEntity.hashPassword(password);
    await this.updateById(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
    });

    return {
      message: "Password has been updated successfully",
    };
  }

  public async verifyEmail(email: string): Promise<boolean> {
    const userExists = await this.findOne({ email });
    return !userExists;
  }

  public generateRandomPassword() {
    return crypto.randomBytes(10).toString("hex");
  }

  private async prepareUpdate(user, profileDto, avatar) {
    if (avatar) {
      const { Location } = await this.fileService.upload(
        user["id"],
        avatar,
        FileFolderEnum.avatar
      );
      return { ...profileDto, avatar: Location };
    }

    return profileDto;
  }
}
