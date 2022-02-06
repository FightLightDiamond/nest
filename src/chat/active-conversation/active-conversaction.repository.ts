import { EntityRepository, Repository } from 'typeorm';
import { ActiveConversationEntity } from './active-conversation.entity';

@EntityRepository(ActiveConversationEntity)
export class ActiveConversationRepository extends Repository<ActiveConversationEntity> {}
