import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';

@Entity('options')
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  text: string;

  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({
    type: 'int',
    nullable: true,
  })
  questionId: number;

  @Column({
    default: false,
    type: 'boolean',
  })
  isCorrect: boolean;
}
