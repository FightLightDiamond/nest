import { EntityRepository, Repository } from 'typeorm';
import { Conversation } from './conversation.entity';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}
