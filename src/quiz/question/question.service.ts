import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {}

  async createQuestion(question: CreateQuestionDto) {
    const newQuestion = await this.questionRepository.save(question);

    // quiz.questions = [newQuestion, ...quiz.questions];
    // await quiz.save();

    return newQuestion;
  }

  async findQuestion(id: number) {
    return await this.questionRepository.findOne(id, {
      relations: ['options', 'quiz'],
    });
  }
}
