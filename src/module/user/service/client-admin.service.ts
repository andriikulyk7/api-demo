import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@entity";
import { MoreThan, Repository } from "typeorm";
import { DBService } from "../../db/service/db.service";
import { UserService } from "./user.service";
import { ClientAdminEntity } from "../../../common/entity/user/client-admin.entity";
import { Utils } from "@utils";
import { MailService } from "../../mail/mail.service";
import { ErrorMessage, UserRole, UserStatus } from "@enum";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { ClientAdminSignUpDto, QueryClientAdminDto } from "@dto";

@Injectable()
export class ClientAdminService {
  private INVITATION_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;

  constructor(
    @InjectRepository(ClientAdminEntity)
    private clientAdminRepository: Repository<ClientAdminEntity>,
    private dbService: DBService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private mailService: MailService
  ) {}

  public async invite(email: string) {
    const registrationToken = Utils.generateRandomToken();
    const hashedToken = Utils.hashString(registrationToken);

    const clientAdminUser = UserEntity.create({
      role: UserRole.client_admin,
      password: this.userService.generateRandomPassword(),
      email: email,
      completeOnboarding: true,
      status: UserStatus.invited,
    });

    const clientAdminProfile = ClientAdminEntity.create({
      invitationToken: hashedToken,
      invitationTokenExpirationDate: new Date(
        Date.now() + this.INVITATION_TOKEN_EXPIRATION_TIME
      ),
    });

    await this.dbService.transaction(async (manager: EntityManager) => {
      const savedClientAdminUser = await manager.save(clientAdminUser);
      clientAdminProfile.userId = savedClientAdminUser.id;
      await manager.save(clientAdminProfile);
    });

    await this.mailService.sendClientAdminInvitation(email, registrationToken);
  }

  public async signUp({ password, token }: ClientAdminSignUpDto) {
    const profile = await this.findByInvitationToken(token);
    const user = await this.userService.findOne({ id: profile.userId });

    user.password = await UserEntity.hashPassword(password);
    profile.invitationToken = null;
    profile.invitationTokenExpirationDate = null;
    const [newUser, newProfile] = await Promise.all([
      user.save(),
      profile.save(),
    ]);

    return newUser;
  }

  public async findByInvitationToken(token) {
    const hashedToken = Utils.hashString(token);
    const NOW = new Date();

    const profile = await this.clientAdminRepository.findOne({
      where: {
        invitationToken: hashedToken,
        invitationTokenExpirationDate: MoreThan(NOW),
      },
    });

    if (!profile) {
      throw new BadRequestException(ErrorMessage.invitation_not_found);
    }

    return profile;
  }

  public async getProfile(userId: string) {
    return this.clientAdminRepository.findOne({ userId });
  }

  public async getManyProfiles(query: QueryClientAdminDto) {
    const { page = 1, pageSize = 10, status } = query;

    const [result, total] = await this.clientAdminRepository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.user", "user")
      .where("user.status = :status", { status })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      result,
      total,
    };
  }
}
