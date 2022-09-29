import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  public readonly completeOnboarding: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  public readonly completeTips: boolean;
}

export class BaseProfile {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public readonly firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public readonly lastName: string;

  @IsOptional()
  @IsString()
  public readonly country: string;

  @IsOptional()
  @IsString()
  public readonly state: string;

  @IsOptional()
  @IsString()
  public readonly city: string;

  @IsOptional()
  @IsString()
  public readonly bio: string;

  @IsOptional()
  @IsString()
  public readonly avatar: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  public completeOnboarding: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  public readonly completeTips: boolean;
}
