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
import {PostEntity} from '../feed/models/post.entity';
import { RoleEnum } from '../auth/role.enum';
import { UserInterface } from './user.interface';
import { FriendRequestEntity } from '../connect/friend-request.entity';
import { ConversationEntity } from '../chat/conversation/conversation.entity';
import { MessageEntity } from '../chat/message/message.entity';
import { Exclude, Expose } from 'class-transformer';
import {ConnectedUserEntity} from "../chat/connected-user/connected-user.entity";
import {JoinedRoomEntity} from "../chat/joined-room/joined-room.entity";
import {RoomEntity} from "../chat/room/room.entity";
import {PollEntity} from "../poll/poll.entity";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity implements UserInterface {
  @Field()
  @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier',
  })
  id: number;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  firstName: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastName: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  @Exclude()
  password: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  imagePath: string;

  @Field()
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: true,
  })
  role: RoleEnum;

  @Field()
  @Column({default: false})
  confirmed: boolean

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Relationship
   */
  // @Field(() => [Post])
  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
  //sent friends
  @OneToMany(
    () => FriendRequestEntity,
    (friendRequest) => friendRequest.creator,
  )
  sentFriendRequests: FriendRequestEntity[];

  //receive friends
  // @Field()
  @OneToMany(
    () => FriendRequestEntity,
    (friendRequest) => friendRequest.receiver,
  )
  receiveFriendRequests: FriendRequestEntity[];

  //conversation
  // @Field()
  @ManyToMany(() => ConversationEntity)
  conversations: ConversationEntity[];

  //message
  // @Field()
  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  //connections
  // @Field()
  @OneToMany(() => ConnectedUserEntity, connection => connection.user)
  connections: ConnectedUserEntity[];

  // join room
  // @Field()
  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  // room entity
  // @Field()
  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[]

  //poll
  // @Field()
  @OneToMany(() => PollEntity, poll => poll.user)
  poll: Promise<PollEntity[]>;

  @BeforeInsert()
  //Hash password before save
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
