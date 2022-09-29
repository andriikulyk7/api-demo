import { HttpException, HttpStatus, PipeTransform } from "@nestjs/common";
import { isDefined, isEnum } from "class-validator";

export class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
  constructor(private readonly validated_enum: any) {
    this.validated_enum = validated_enum;
  }

  transform(value: string): Promise<any> {
    if (isDefined(value) && isEnum(value, this.validated_enum)) {
      return this.validated_enum[value];
    }

    const error_message = EnumValidationPipe.buildError(this.validated_enum);

    throw new HttpException(error_message, HttpStatus.BAD_REQUEST);
  }

  private static buildError(enum_item) {
    const valid_credentials = Object.values(enum_item).join(", ");
    return `Invalid action parameter. See the acceptable values: ${valid_credentials}`;
  }
}
