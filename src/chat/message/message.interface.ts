import { UserEntity } from '../../user/user.entity';
import { ConversationEntity } from '../conversation/conversation.entity';

export interface MessageInterface {
  id?: number;
  message?: string;
  user?: UserEntity;
  conversation: ConversationEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
