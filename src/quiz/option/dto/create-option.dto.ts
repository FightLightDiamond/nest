import { IsBoolean, IsNotEmpty, Length } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty({ message: 'The option should have a text' })
  @Length(3, 255)
  text: string;

  @IsNotEmpty()
  questionId: number;

  @IsBoolean()
  isCorrect: boolean;
}
