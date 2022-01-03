import { IsNotEmpty, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'The product should have a title' })
  @Length(3, 255)
  title: string;
  @IsNotEmpty({ message: 'The product should have a image' })
  @Length(3, 255)
  image: string;
}
