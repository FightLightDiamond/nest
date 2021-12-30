import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './quiz.entity';

/**
 * Quiz Controller
 */
@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  /**
   * Get All Quiz
   */
  @Get('/')
  getAllQuiz(): Promise<Quiz[]> {
    return this.quizService.getAllQuiz();
  }

  /**
   * Get By Id
   * @param id
   */
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Quiz> {
    return await this.quizService.getQuizById(id);
  }

  /**
   * Create Quiz
   * @param quizData
   */
  @Post('/')
  @UsePipes(ValidationPipe)
  async createQuiz(@Body() quizData: CreateQuizDto) {
    return await this.quizService.createNewQuiz(quizData);
  }
}
