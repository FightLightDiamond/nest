import { IsNotEmpty, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'The question should have a question' })
  @Length(3, 255)
  question: string;

  @IsNotEmpty()
  quizId: number;
}
