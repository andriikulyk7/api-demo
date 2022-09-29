import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform((obj) => obj.value.toLowerCase())
  public readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  public readonly password: string;
}
