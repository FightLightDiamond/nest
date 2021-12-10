import { EntityRepository, Repository } from 'typeorm';
import { FriendRequest } from './friend-request.entity';

@EntityRepository(FriendRequest)
export class FriendRequestRepository extends Repository<FriendRequest> {}
