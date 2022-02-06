import {
  Column,
  CreateDateColumn,
  Entity, JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { ConversationEntity } from '../conversation/conversation.entity';
import {RoomEntity} from "../room/room.entity";

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  // many to one user
  @ManyToOne(() => UserEntity, (user) => user.messages)
  user: UserEntity;

  // many to one conversation
  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages)
  conversation: ConversationEntity;

  @ManyToOne(() => RoomEntity, room => room.messages)
  @JoinTable()
  room: RoomEntity;

  @CreateDateColumn()
  createdAt: Date;
}
