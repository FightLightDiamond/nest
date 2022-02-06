import { UserEntity } from '../user/user.entity';

export type TFriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface IFriendRequestStatus {
  status?: TFriendRequestStatus;
}

export interface IFriendRequestInterface {
  id?: number;
  creator?: UserEntity;
  receiver?: UserEntity;
  status?: TFriendRequestStatus;
}
