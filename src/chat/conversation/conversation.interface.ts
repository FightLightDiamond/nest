import { UserEntity } from '../../user/user.entity';

export interface ConversationInterface {
  id?: number;
  users?: UserEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}
