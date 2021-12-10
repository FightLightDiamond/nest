import { EntityRepository, Repository } from 'typeorm';
import { ActiveConversation } from './active-conversation.entity';

@EntityRepository(ActiveConversation)
export class ActiveConversationRepository extends Repository<ActiveConversation> {}
