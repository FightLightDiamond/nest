import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PollOptionEntity } from './pollOption.entity';

@ObjectType()
@Entity('polls')
export class PollEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, user => user.poll)
  user: Promise<UserEntity>; // generated a userId

  @Field(() => [PollOptionEntity])
  @OneToMany(() => PollOptionEntity, pollOption => pollOption.poll)
  pollOption: Promise<PollOptionEntity[]>;
}
