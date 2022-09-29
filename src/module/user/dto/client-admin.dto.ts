import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ClientAdminSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      "password must contain at lest: 1 lowercase, 1 uppercase and 1 digit",
  })
  public readonly password: string;
}
