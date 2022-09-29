import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity, UserEntity } from "@entity";
import { Repository } from "typeorm";
import { CreateAdminDto } from "../../authentication/dto/admin.dto";
import { ErrorMessage, UserRole, UserStatus } from "@enum";
import { DBService } from "../../db/service/db.service";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { UserService } from "./user.service";
import { ClientAdminService } from "./client-admin.service";
import { EvaluateClientAdminDto, QueryClientAdminDto } from "@dto";
import { MailService } from "../../mail/mail.service";
import { ClientAdminEntity } from "../../../common/entity/user/client-admin.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private dbService: DBService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private clientAdminService: ClientAdminService,
    private mailService: MailService
  ) {}

  public async inviteClientAdmin(email: string) {
    const validEmail = await this.userService.verifyEmail(email);

    if (!validEmail) {
      throw new BadRequestException(ErrorMessage.user_exists);
    }

    await this.clientAdminService.invite(email);
  }

  public async create(adminDto: CreateAdminDto) {
    const validEmail = await this.userService.verifyEmail(adminDto.email);

    if (!validEmail) {
      throw new BadRequestException(ErrorMessage.user_exists);
    }

    const adminUser = UserEntity.create({
      role: UserRole.admin,
      password: adminDto.password,
      email: adminDto.email,
      completeOnboarding: true,
      status: UserStatus.active,
    });

    const adminProfile = AdminEntity.create({
      firstName: adminDto.firstName,
      lastName: adminDto.lastName,
    });

    await this.dbService.transaction(async (manager: EntityManager) => {
      const savedAdminUser = await manager.save(adminUser);
      adminProfile.userId = savedAdminUser.id;
      await manager.save(adminProfile);
    });
  }

  public async evaluateClientAdmin({
    userId,
    approve,
  }: EvaluateClientAdminDto) {
    // todo: verify current status
    const status = approve ? UserStatus.active : UserStatus.rejected;
    const { email }: UserEntity = await this.userService.updateById(userId, {
      status,
    });
    const { firstName }: ClientAdminEntity =
      await this.clientAdminService.getProfile(userId);

    await this.mailService.sendClientAdminEvaluatioMail(
      email,
      firstName,
      approve
    );
    return status;
  }

  public async getProfile(userId: string) {
    return this.adminRepository.findOne({ userId });
  }

  public async getClientAdmins(query: QueryClientAdminDto) {
    return this.clientAdminService.getManyProfiles(query);
  }
}
