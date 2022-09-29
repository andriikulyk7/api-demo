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
import { UserEntity } from "./user.entity";
import { JoinColumn } from "typeorm";

@Entity({ name: DBTableEnum.admin })
export class AdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @OneToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn()
  public user: UserEntity;

  @Column({ type: "uuid", nullable: true })
  public userId: string;

  @Column({ type: "text" })
  public readonly firstName: string;

  @Column({ type: "text", nullable: true })
  public readonly lastName: string;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;
}
