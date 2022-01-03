import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The post unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  body: string;

  @ManyToOne(() => User, (author) => author.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  // @Column({
  //   type: 'int',
  //   nullable: true,
  //   unsigned: true,
  // })
  // authorId: number;

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
  @CreateDateColumn()
  createdAt: Date;
}
