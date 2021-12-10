import { User } from '../user/user.entity';

export type TFriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface IFriendRequestStatus {
  status?: TFriendRequestStatus;
}

export interface IFriendRequestInterface {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: TFriendRequestStatus;
}
