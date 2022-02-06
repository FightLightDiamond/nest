import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('posts')
export class PostEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({
    comment: 'The post unique identifier',
  })
  id: number;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  body: string;

  // @Field()
  @ManyToOne(() => UserEntity, (author) => author.posts)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  // @Column({
  //   type: 'int',
  //   nullable: true,
  //   unsigned: true,
  // })
  // authorId: number;

  @Field()
  @Column('varchar', {
    default: [],
    transformer: {
      to(value: any[]): string {
        return JSON.stringify(value);
      },
      from(value: string): any[] {
        return JSON.parse(value);
      },
    },
  })

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
