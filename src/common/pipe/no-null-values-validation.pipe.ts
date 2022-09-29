import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

export class NoNullValuesValidationPipe implements PipeTransform {
  transform(value: Record<string, any>, metadata: ArgumentMetadata): any {
    if (value && typeof value === "object") {
      const nullEntry = Object.entries(value).find(([k, v]) => v === null);

      if (nullEntry) {
        const [nullKey] = nullEntry;
        throw new BadRequestException(
          `Query object can not contain null values, but key:${nullKey} was null`
        );
      }

      return value;
    }
  }
}
