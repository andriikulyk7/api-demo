import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class PasswordDto {
  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "password must contain at lest: 1 lowercase, 1 uppercase and 1 digit",
  })
  public readonly newPassword: string;

  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "password must contain at lest: 1 lowercase, 1 uppercase and 1 digit",
  })
  public readonly confirmPassword: string;
}

export class UpdatePasswordDto extends PasswordDto {
  @IsNotEmpty()
  public readonly currentPassword: string;
}

export class ResetPasswordIntentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toString().toLowerCase())
  public email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "The password must contain at lest: 1 lowercase, 1 uppercase and 1 digit and be between 8 and 20 characters long",
  })
  public readonly password: string;
}
