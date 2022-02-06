import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_conversations')
export class ActiveConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  userId: number;

  @Column()
  conversationId: number;
}
