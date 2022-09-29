import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { UserRole } from "@enum";
import { Transform } from "class-transformer";

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: `role must be: ${UserRole.admin} or ${UserRole.client_admin}`,
  })
  public role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toString().toLowerCase())
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "password must contain at lest: 1 lowercase, 1 uppercase and 1 digit",
  })
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
