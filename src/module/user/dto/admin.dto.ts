import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Transform } from "class-transformer";
import { UserStatus } from "@enum";

export class InviteClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toString().toLowerCase())
  public readonly email: string;
}

export class EvaluateClientAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public readonly approve: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public readonly userId: string;
}

export class QueryClientAdminDto {
  @ApiProperty()
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  pageSize: number;
}
