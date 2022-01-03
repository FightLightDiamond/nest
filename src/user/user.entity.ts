import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from '../feed/models/post.entity';
import { RoleEnum } from '../auth/role.enum';
import { UserInterface } from './user.interface';
import { FriendRequest } from '../connect/friend-request.entity';
import { Conversation } from '../chat/conversation/conversation.entity';
import { Message } from '../chat/message/message.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imagePath: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: true,
  })
  role: RoleEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Relationship
   */
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  //sent friends
  @OneToMany(
    () => FriendRequest,
    (friendRequestEntity) => friendRequestEntity.creator,
  )
  sentFriendRequests: FriendRequest[];

  //receive friends
  @OneToMany(
    () => FriendRequest,
    (friendRequestEntity) => friendRequestEntity.receiver,
  )
  receiveFriendRequests: FriendRequest[];

  //conversation
  @ManyToMany(() => Conversation)
  conversations: Conversation[];

  //message
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
