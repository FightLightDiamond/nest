import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { TFriendRequestStatus } from './friend-request.interface';

@Entity('friend_requests')
export class FriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  status: TFriendRequestStatus;

  //creator
  @ManyToOne(() => User, (creator) => creator.sentFriendRequests)
  @JoinColumn({ name: 'creator' })
  creator: User;
  //receive
  @ManyToOne(() => User, (receiver) => receiver.receiveFriendRequests)
  @JoinColumn({ name: 'receiver' })
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => Post, (post) => post.author)
  // posts: Post[];
}
