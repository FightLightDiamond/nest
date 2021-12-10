import { User } from '../../user/user.entity';

export interface ConversationInterface {
  id?: number;
  users?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}
