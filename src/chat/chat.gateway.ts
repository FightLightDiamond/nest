import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {
  HttpException,
  HttpStatus,
  Logger,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { of, Subscription, take, tap } from 'rxjs';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation/conversation.service';
import { AuthService } from '../auth/auth.service';
import { UserInterface } from '../user/user.interface';
import { MessageInterface } from './message/message.interface';
import { Message } from './message/message.entity';
import { ActiveConversation } from './active-conversation/active-conversation.entity';
import { Cron } from '@nestjs/schedule';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
// @WebSocketGateway({ cors: true })
// @WebSocketGateway(3006, { cors: true })
export class ChatGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('MessageGateway');

  /**
   * @param userService
   * @param jwtService
   * @param conversationService
   * @param authService
   */
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private conversationService: ConversationService,
    private authService: AuthService,
  ) {}

  //Note: Runs when server starts
  onModuleInit() {
    // this.conversationService
    //   .removeActiveConversations()
    //   .pipe(take(1))
    //   .subscribe();
    // this.conversationService.removeMessages().pipe(take(1)).subscribe();
    // this.conversationService.removeConversations().pipe(take(1)).subscribe();
  }

  /**
   * Handle Connection
   * @param client
   */
  @UseGuards(JwtGuard)
  async handleConnection(client: Socket) {
    this.logger.log(client.id, 'Connected..............................');

    const jwt = client.handshake?.headers?.authorization || null;
    this.authService.getJwtUser(jwt).subscribe((user: UserInterface) => {
      if (!user) {
        console.log('No user');
        this.handleDisconnect(client);
      } else {
        client.data.user = user;
        this.getConversations(client, user.id);
      }
    });
    client.join('some room');

    client.to('some room').emit('some event', 'abc');
  }

  /**
   * Get Conversation
   * @param socket
   * @param userId
   */
  getConversations(socket: Socket, userId: number): Subscription {
    return this.conversationService
      .getConversationsWithUsers(userId)
      .subscribe((conversation) => {
        this.server.to(socket.id).emit('conversations', conversation);
      });
  }

  /**
   * After Init
   * @param server
   */
  afterInit(server: any): any {
    this.logger.log(server, 'Init');
  }

  /**
   * Disconnect
   * @param client
   */
  async handleDisconnect(client: Socket) {
    this.logger.log(client.id, 'Disconnect');
    this.conversationService
      .leaveConversation(client.id)
      .pipe(take(1))
      .subscribe();
  }

  /**
   * Handle Message
   * @param client
   * @param newMessage
   */
  @SubscribeMessage('sentMessage')
  handleMessage(client: Socket, newMessage: MessageInterface) {
    console.log('handleMessage', newMessage);
    debugger;
    if (!newMessage.conversation) return of(null);

    const { user } = client.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      this.conversationService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: Message) => {
          newMessage.id = message.id;

          this.conversationService
            .getActiveUsers(newMessage.conversation.id)
            .pipe(take(1))
            .subscribe((activeConversations: ActiveConversationInterface[]) => {
              activeConversations.forEach(
                (activeConversation: ActiveConversationInterface) => {
                  this.server
                    .to(activeConversation.socketId)
                    .emit('newMessage', newMessage);
                },
              );
            });
        });
    }
  }

  /**
   * Create Conversation
   * @param socket
   * @param friend
   */
  @SubscribeMessage('createConversation')
  createConversation(socket: Socket, friend: User) {
    if (!socket.data?.user) {
      console.log('socket.id', socket.id);
      this.server.to(socket.id).emit('401', '401');
      return;
    }
    debugger;
    this.conversationService
      .createConversation(socket.data?.user, friend)
      .pipe(take(1))
      .subscribe(() => {
        this.getConversations(socket, socket.data?.user?.id);
      });
  }

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: number) {
    this.conversationService
      .joinConversation(friendId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeConversation: ActiveConversation) => {
          this.conversationService
            .getMessages(activeConversation.conversationId)
            .pipe(take(1))
            .subscribe((messages: Message[]) => {
              this.server.to(socket.id).emit('messages', messages);
            });
        }),
      )
      .pipe(take(1))
      .subscribe();
  }

  @SubscribeMessage('leaveConversation')
  leaveConversation(socket: Socket) {
    this.conversationService
      .leaveConversation(socket.id)
      .pipe(take(1))
      .subscribe();
  }

  async getDataUserFromToken(client: Socket): Promise<any> {
    // const authToken: any = client.handshake?.query?.token;
    const authToken: any = client.handshake?.headers?.authorization;
    try {
      const decoded = this.jwtService.verify(authToken);
      console.log({ decoded });
      debugger;

      return await this.userService.getUserByEmail(decoded.user.email); // response to function
    } catch (ex) {
      console.log({ ex });
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  @Cron('*/25 * * * * *', {
    name: 'cronSW',
  })
  cronSW() {
    this.logger.debug('cronSW: ' + Date.now());
    this.server.emit('cronSW', 'cronSW');
  }
}
