import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { QuizService } from '../quiz/quiz.service';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Controller('question')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
    private quizService: QuizService,
  ) {}

  @Get('/')
  @UsePipes(ValidationPipe)
  getQuestions() {
    return 123;
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  async saveQuestion(@Body() question: CreateQuestionDto): Promise<Question> {
    const quiz = await this.quizService.getQuizById(question.quizId);
    if (isNil(quiz)) {
      throw new HttpException([{ quiz: 'Quiz not exist' }], 422);
    }

    try {
      // First check if quiz exist
      return await this.questionService.createQuestion(question);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
