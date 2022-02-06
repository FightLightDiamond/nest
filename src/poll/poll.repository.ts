import { EntityRepository, Repository } from 'typeorm';
import { PollEntity } from './poll.entity';

@EntityRepository(PollEntity)
export class PollRepository extends Repository<PollEntity> {}
