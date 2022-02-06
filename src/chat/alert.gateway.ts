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
  Logger,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Subscription, take } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation/conversation.service';
import { AuthService } from '../auth/auth.service';
import { UserInterface } from '../user/user.interface';
import { MessageInterface } from './message/message.interface';

@WebSocketGateway({ cors: true, path: '/websockets', serveClient: true, namespace: '/alert' })
export class AlertGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('MessageGateway');
  activeUsers: any = {}

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

  }

  /**
   * Handle Connection
   * @param client
   */
  @UseGuards(JwtGuard)
  async handleConnection(client: Socket) {
    this.logger.log('Connected..............................' + client.id);
    const jwt = client.handshake?.headers?.authorization || null;

    this.authService.getJwtUser(jwt).subscribe((user: UserInterface) => {
      if (!user) {
        console.log('No user');
        this.handleDisconnect(client);
      } else {
        client.data.user = user;
        console.log({user})
        this.getConversations(client, user.id);
      }
    });
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
    this.logger.log(server, 'Initialized!');
  }

  /**
   * Disconnect
   * @param client
   */
  async handleDisconnect(client: Socket) {
    this.logger.log('Disconnect.......' + client.id);
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
  }

  @SubscribeMessage('offer')
  offer(socket: Socket, { id, message }) {
    socket.to(id).emit('offer', socket.id, message);
  }

  @SubscribeMessage('answer')
  answer(socket: Socket, { id, message }) {
    socket.to(id).emit('answer', socket.id, message);
  }

  @SubscribeMessage('candidate')
  candidate(socket: Socket, { id, message }) {
    socket.to(id).emit('candidate', socket.id, message);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    console.log('events', data)
    // id === messageBody.id
    const event = 'events';
    return { event, data };
  }
}
