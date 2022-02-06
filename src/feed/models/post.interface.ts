import { UserEntity } from '../../user/user.entity';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  authorId?: number;
  author?: UserEntity;
}
