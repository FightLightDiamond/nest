import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../quiz/quiz.entity';
import { Option } from '../option/option.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  question: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @Column({ type: 'int', nullable: true })
  quizId: number;
}
