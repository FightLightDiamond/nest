import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { QuestionService } from '../question/question.service';
import { isNil } from '@nestjs/common/utils/shared.utils';

/**
 * Option Controller
 */
@Controller('option')
export class OptionController {
  constructor(
    private optionService: OptionService,
    private questionService: QuestionService,
  ) {}

  /**
   * Save Option To Question
   * @param createOption
   */
  @Post('/')
  async saveOptionToQuestion(@Body() createOption: CreateOptionDto) {
    const question = await this.questionService.findQuestion(
      createOption.questionId,
    );
    if (isNil(question)) {
      throw new HttpException(
        [
          {
            question: 'Question do not exist',
          },
        ],
        422,
      );
    }
    try {
      const option = await this.optionService.createOption(
        createOption,
        question,
      );
      return { option, question };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
