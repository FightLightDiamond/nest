import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionRepository } from './option.repository';
import { CreateOptionDto } from './dto/create-option.dto';
import { Question } from '../question/question.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionRepository)
    private optionRepository: OptionRepository,
  ) {}
  async createOption(option: CreateOptionDto, question: Question) {
    const newOption = await this.optionRepository.save(option);
    question.options = [...question.options, newOption];
    await question.save();
    return newOption;
  }
}
