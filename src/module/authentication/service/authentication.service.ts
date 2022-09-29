import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import * as moment from "moment";
import {
  IDefaultResponse,
  IFullProfile,
  IRequestParams,
  ISignIn,
  ISignInResponse,
  IUser,
  IUserRequest,
} from "@interface";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { ErrorMessage, SuccessMessage, UserRole, UserStatus } from "@enum";
import { CreateAdminDto, SignInDto, SignUpDto } from "@dto";
import { DBService } from "../../db/service/db.service";
import { UserService } from "../../user/service/user.service";
import { AdminService } from "../../user/service/admin.service";

@Injectable()
export class AuthenticationService {
  private roleStatusesToLogin: Record<UserRole, UserStatus[]> = {
    [UserRole.admin]: [UserStatus.active],
    [UserRole.client_admin]: [UserStatus.active],
  };

  constructor(
    private readonly dbService: DBService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  public async signUp(user_dto: SignUpDto): Promise<IDefaultResponse> {
    await this.signUpDefault(user_dto);

    return {
      message: SuccessMessage.sign_up_success,
    };
  }

  public async signUpSocial(user_dto: SignUpDto): Promise<ISignInResponse> {
    const user = await this.signUpDefault(user_dto);
    const fullProfile = await this.userService.getUser({ id: user["id"] });
    const accessToken = this.generateAccessToken({
      userId: fullProfile["user"]["id"],
    });

    await this.updateLastActivity(user);

    return {
      ...fullProfile,
      accessToken,
    };
  }

  public async adminSignUp(admin_dto: CreateAdminDto) {
    const validMail = await this.verifyEmail(admin_dto.email);

    if (!validMail) {
      throw new BadRequestException(ErrorMessage.user_exists);
    }

    await this.adminService.create(admin_dto);

    return {
      message: SuccessMessage.sign_up_success,
    };
  }

  public async signIn(user_dto: SignInDto): Promise<ISignInResponse> {
    const verifiedUser = await this.validate(user_dto);
    const accessToken = this.generateAccessToken({
      userId: verifiedUser["user"]["id"],
    });

    await this.updateLastActivity(verifiedUser["user"]);

    return {
      ...verifiedUser,
      accessToken,
    };
  }

  public async socialSignIn(email: string): Promise<ISignInResponse> {
    const user = await this.userService.findOne({ email });
    const fullProfile = await this.userService.getUser({ id: user["id"] });
    const accessToken = this.generateAccessToken({
      userId: fullProfile["user"]["id"],
    });

    await this.updateLastActivity(user);

    return {
      ...fullProfile,
      accessToken,
    };
  }

  public generateRandomPassword() {
    return crypto.randomBytes(10).toString("hex");
  }

  public async authenticate(user: IUserRequest): Promise<IFullProfile> {
    return this.userService.getUser(user);
  }

  public async refreshToken(user: IUserRequest): Promise<ISignInResponse> {
    const userProfile = await this.userService.getUser(user);

    const accessToken = this.generateAccessToken({ userId: user["id"] });

    return {
      ...userProfile,
      accessToken,
    };
  }

  public userCanLogin(user: IUser) {
    if (!user) {
      return false;
    }

    const { role, status } = user;

    return this.roleStatusesToLogin[role].includes(status);
  }

  private async updateLastActivity(user): Promise<void> {
    const date = moment().format();
    await this.userService.update({ id: user["id"] }, { lastActivity: date });
  }

  private async validate(user_dto: ISignIn): Promise<IFullProfile> {
    const { email, password: inputPassword } = user_dto;
    const user = await this.userService.findOne({ email });
    const canLogin = this.userCanLogin(user);

    if (!user) {
      throw new BadRequestException(ErrorMessage.user_not_exists);
    }

    if (!canLogin) {
      throw new BadRequestException(ErrorMessage.unable_to_login);
    }

    const comparePassword = await user.verifyPassword(inputPassword);

    if (!comparePassword) {
      throw new BadRequestException(ErrorMessage.incorrect_credentials);
    }

    return this.userService.getUser({ id: user["id"] });
  }

  private async verifyEmail(email: string): Promise<boolean> {
    const userExists = await this.userService.findOne({ email });
    return !userExists;
  }

  private generateAccessToken(params: IRequestParams): string {
    return this.jwtService.sign({ ...params });
  }

  private async signUpDefault(user_dto: SignUpDto): Promise<IUser> {
    const validMail = await this.verifyEmail(user_dto.email);

    if (!validMail) {
      throw new BadRequestException(ErrorMessage.user_exists);
    }

    const user = this.userService.create(user_dto);

    await this.dbService.transaction(async (manager: EntityManager) => {
      await manager.save(user);
    });

    return user;
  }
}
