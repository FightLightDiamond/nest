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
import {Exclude, Expose} from "class-transformer";

@ObjectType()
@Entity('posts')
// @Exclude()
export class PostEntity extends BaseEntity {
  @Field()
  @Expose()
  @PrimaryGeneratedColumn({
    comment: 'The post unique identifier',
  })
  id: number;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  // @Expose()
  // @Expose({ groups: ['user'] })
  body: string;

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
