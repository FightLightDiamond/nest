import { Length } from 'class-validator';

export class UpdateProductDto {
  @Length(3, 255)
  title: string;
  @Length(3, 255)
  image: string;
}
