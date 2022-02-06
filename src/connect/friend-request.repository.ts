import { EntityRepository, Repository } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';

@EntityRepository(FriendRequestEntity)
export class FriendRequestRepository extends Repository<FriendRequestEntity> {}
