import { User } from '../../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';

export interface MessageInterface {
  id?: number;
  message?: string;
  user?: User;
  conversation: Conversation;
  createdAt?: Date;
  updatedAt?: Date;
}
