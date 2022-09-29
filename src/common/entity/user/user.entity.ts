import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import { IsEmail } from "class-validator";
import { DBTableEnum, UserRole, UserStatus } from "@enum";
import { IUserSecure } from "@interface";

@Entity({ name: DBTableEnum.user })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({
    type: "enum",
    enum: [UserRole.admin, UserRole.client_admin],
  })
  public readonly role: UserRole | string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.active })
  public readonly status: UserStatus;

  @Column({ type: "text", unique: true })
  @IsEmail()
  public readonly email: string;

  @Column({ type: "text" })
  public password: string;

  @Column({ type: "date", default: moment().format() })
  public lastActivity: Date;

  @Column({ type: "boolean", nullable: true, default: false })
  public completeOnboarding: boolean;

  @Column({ type: "boolean", nullable: true, default: false })
  public completeTips: boolean;

  @Column({ type: "text", nullable: true, default: null })
  public resetPasswordToken: string;

  @Column({ type: "timestamp", nullable: true, default: null })
  public resetPasswordTokenExpirationDate: Date;

  @CreateDateColumn()
  private readonly createdAt: Date;

  @UpdateDateColumn()
  private readonly updatedAt: Date;

  public get getId(): string {
    return this.id;
  }

  public async validateUpdatePassword(
    secure_dto: IUserSecure
  ): Promise<{ isValid: boolean; password: string }> {
    const { currentPassword, newPassword, confirmPassword } = secure_dto;
    const isValid =
      (await this.verifyPassword(currentPassword)) &&
      newPassword === confirmPassword;
    const hashPassword = await UserEntity.hashPassword(newPassword);

    return {
      isValid,
      password: hashPassword,
    };
  }

  public async verifyPassword(plain: string): Promise<boolean> {
    const original = this.password;
    return await bcrypt.compare(plain, original);
  }

  @BeforeInsert()
  private async setHashPassword(): Promise<void> {
    this.password = await UserEntity.hashPassword(this.password);
  }

  public static async hashPassword(plain: string, round = 10): Promise<string> {
    const salt = await bcrypt.genSalt(round);
    return bcrypt.hash(plain, salt);
  }
}
