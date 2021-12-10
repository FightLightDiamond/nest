import { RoleEnum } from '../auth/role.enum';
import { FeedPost } from '../feed/models/post.interface';

export interface UserInterface {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imagePath?: string;
  role?: RoleEnum;
  posts?: FeedPost[];
}
