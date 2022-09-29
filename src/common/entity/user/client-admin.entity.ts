import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DBTableEnum } from "@enum";
import { UserEntity } from "@entity";
import { JoinColumn } from "typeorm";

@Entity({ name: DBTableEnum.client_admin })
export class ClientAdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @OneToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn()
  public user: UserEntity;

  @Column({ type: "uuid", nullable: true })
  public userId: string;

  @Column({ type: "text", nullable: true })
  public readonly firstName: string;

  @Column({ type: "text", nullable: true })
  public readonly lastName: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @Column({ type: "text", nullable: true, default: null })
  public invitationToken: string;

  @Column({ type: "timestamp", nullable: true, default: null })
  public invitationTokenExpirationDate: Date;
}
