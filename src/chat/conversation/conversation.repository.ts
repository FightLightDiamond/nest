import { EntityRepository, Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity> {}
