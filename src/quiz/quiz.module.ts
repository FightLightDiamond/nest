import { Module } from '@nestjs/common';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizRepository } from './quiz/quiz.repository';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionRepository } from './question/question.repository';
import { OptionRepository } from './option/option.repository';
import { OptionService } from './option/option.service';
import { OptionController } from './option/option.controller';

@Module({
  controllers: [QuizController, QuestionController, OptionController],
  imports: [
    TypeOrmModule.forFeature([
      QuizRepository,
      QuestionRepository,
      OptionRepository,
    ]),
  ],
  providers: [QuizService, QuestionService, OptionService],
})
export class QuizModule {}
