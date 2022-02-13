import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'yup';
import { serializeValidationError } from '../utils/serializeValidationError';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema<{}>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await this.schema.validate(value, { abortEarly: false });
    } catch (err) {
      console.log(err);
      throw serializeValidationError(err);
    }
    return value;
  }
}
