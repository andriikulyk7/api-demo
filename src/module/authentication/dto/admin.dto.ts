import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toString().toLowerCase())
  public readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "password must contain at lest: 1 lowercase, 1 uppercase and 1 digit",
  })
  public readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly lastName: string;
}
