import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationRepository } from './conversation.repository';
import { ActiveConversationRepository } from '../active-conversation/active-conversaction.repository';
import { MessageRepository } from '../message/message.repository';
import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { Conversation } from './conversation.entity';
import { User } from '../../user/user.entity';
import { ConversationInterface } from './conversation.interface';
import { DeleteResult } from 'typeorm';
import { MessageInterface } from '../message/message.interface';

/**
 * Conversation Service
 */
@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationRepository)
    private conversationRepository: ConversationRepository,
    @InjectRepository(ActiveConversationRepository)
    private activeConversationRepository: ActiveConversationRepository,
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  /**
   * Get Conversation
   * @param creatorId
   * @param friendId
   */
  getConversation(
    creatorId: number,
    friendId: number,
  ): Observable<ConversationInterface | undefined> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversations')
        .leftJoin('conversations.users', 'users')
        .where('users.id = :creatorId', { creatorId })
        .orWhere('users.id = :friendId', { friendId })
        .groupBy('conversations.id')
        .having('COUNT(*) > 1')
        .getOne(),
    ).pipe(
      map((conversation: ConversationInterface) => conversation || undefined),
    );
  }

  /**
   * Create Conversation
   * @param creator
   * @param friend
   */
  createConversation(
    creator: User,
    friend: User,
  ): Observable<ConversationInterface> {
    console.log('Begin create conversation');
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: ConversationInterface) => {
        debugger;
        if (!conversation) {
          const newConversation: ConversationInterface = {
            users: [creator, friend],
          };
          console.log('Save newConversation');
          return from(this.conversationRepository.save(newConversation));
        }
        console.log({ conversation });
        return of(conversation);
      }),
    );
  }

  /**
   * Get Conversations For User
   * @param userId
   */
  getConversationsForUser(userId: number): Observable<ConversationInterface[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversations')
        .leftJoin('conversations.users', 'users')
        .where('users.id = :userId', { userId })
        .orderBy('conversations.lastUpdated', 'DESC')
        .getMany(),
    );
  }

  /**
   * Get Users In Conversation
   * @param conversationId
   */
  getUsersInConversation(conversationId: number): Observable<Conversation[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversations')
        .innerJoinAndSelect('conversations.users', 'users')
        .where('conversations.id = :conversationId', { conversationId })
        .getMany(),
    );
  }

  /**
   * Get Conversations With Users
   * @param userId
   */
  getConversationsWithUsers(
    userId: number,
  ): Observable<ConversationInterface[]> {
    return this.getConversationsForUser(userId).pipe(
      take(1),
      switchMap((conversation: ConversationInterface[]) => conversation),
      mergeMap((conversation: ConversationInterface) => {
        return this.getUsersInConversation(conversation.id);
      }),
    );
  }

  /**
   * Join Conversation
   * @param friendId
   * @param userId
   * @param socketId
   */
  joinConversation(
    friendId: number,
    userId: number,
    socketId: string,
  ): Observable<ActiveConversationInterface> {
    return this.getConversation(userId, friendId).pipe(
      switchMap((conversation: Conversation) => {
        if (!conversation) {
          console.log(
            `No conversation exists for userId: ${userId} and friendId: ${friendId}`,
          );
          return of();
        }
        const conversationId = conversation.id;
        return from(this.activeConversationRepository.findOne({ userId })).pipe(
          switchMap((activeConversation: ActiveConversationInterface) => {
            if (activeConversation) {
              return from(
                this.activeConversationRepository.delete({ userId }),
              ).pipe(
                switchMap(() => {
                  return from(
                    this.activeConversationRepository.save({
                      socketId,
                      userId,
                      conversationId,
                    }),
                  );
                }),
              );
            } else {
              return from(
                this.activeConversationRepository.save({
                  socketId,
                  userId,
                  conversationId,
                }),
              );
            }
          }),
        );
      }),
    );
  }

  /**
   * Leave Conversation
   * @param socketId
   */
  leaveConversation(socketId: string): Observable<DeleteResult> {
    return from(this.activeConversationRepository.delete({ socketId }));
  }

  /**
   * Get Active Users
   * @param conversationId
   */
  getActiveUsers(
    conversationId: number,
  ): Observable<ActiveConversationInterface[]> {
    return from(
      this.activeConversationRepository.find({
        where: [{ conversationId }],
      }),
    );
  }

  getMessages(conversationId: number): Observable<MessageInterface[]> {
    return from(
      this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversation.id =:conversationId', { conversationId })
        .orderBy('message.createdAt', 'ASC')
        .getMany(),
    );
  }

  // Note: Would remove below in production - helper methods
  removeActiveConversations() {
    return from(
      this.activeConversationRepository.createQueryBuilder().delete().execute(),
    );
  }

  removeMessages() {
    return from(this.messageRepository.createQueryBuilder().delete().execute());
  }

  removeConversations() {
    return from(
      this.conversationRepository.createQueryBuilder().delete().execute(),
    );
  }

  createMessage(message: MessageInterface): Observable<MessageInterface> {
    return from(this.messageRepository.save(message));
  }
}
