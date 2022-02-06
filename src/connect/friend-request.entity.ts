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
import { UserEntity } from '../user/user.entity';
import { TFriendRequestStatus } from './friend-request.interface';

@Entity('friend_requests')
export class FriendRequestEntity extends BaseEntity {
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
  @ManyToOne(() => UserEntity, (creator) => creator.sentFriendRequests)
  @JoinColumn({ name: 'creator' })
  creator: UserEntity;
  //receive
  @ManyToOne(() => UserEntity, (receiver) => receiver.receiveFriendRequests)
  @JoinColumn({ name: 'receiver' })
  receiver: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => Post, (post) => post.author)
  // posts: Post[];
}
