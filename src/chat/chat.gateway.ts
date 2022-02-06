import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException,
  WsResponse,
} from '@nestjs/websockets';
import {
  HttpException,
  HttpStatus,
  Logger,
  OnModuleInit, UseFilters,
  UseGuards,
  UseInterceptors,
  WsExceptionFilter,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { of, Subscription, take, tap } from 'rxjs';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation/conversation.service';
import { AuthService } from '../auth/auth.service';
import { UserInterface } from '../user/user.interface';
import { MessageInterface } from './message/message.interface';
import { MessageEntity } from './message/message.entity';
import { ActiveConversationEntity } from './active-conversation/active-conversation.entity';
import { Cron } from '@nestjs/schedule';
import {AllExceptionsFilter} from "./allExceptionHandle";

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// @WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
@WebSocketGateway({ cors: true, path: '/websockets', serveClient: true, namespace: '/chat' })
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
    this.server.socketsJoin('room')
    client.on('room', function(room) {
      client.join(room);
    });

    // this.server.to('room').emit('roomx', 'roomx');
    // this.server.socketsJoin('abc');
    // // this.server.engine.join('abc')
    // this.server.of('abc').to('abc')
    // this.server.local.to('abc')

    this.logger.log('Connected..............................' + client.id);
    // this.logger.log('Number..............................' + this.server.engine.clientsCount);
    // this.logger.log('/..............................' + this.server.of('/').sockets.size);
    // this.logger.log('/ROM..............................', JSON.stringify(this.server.of('/').adapter.rooms.values()));
    // this.logger.log('/ROM sids........................', this.server.of('/').adapter.sids);
    // this.activeUsers[1].push(client.id)
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

    // client.join('some room');
    // client.to('some room').emit('some event', 'some event');
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
    debugger;
    if (!newMessage.conversation) return of(null);

    const { user } = client.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      this.conversationService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: MessageEntity) => {
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
  createConversation(socket: Socket, friend: UserEntity) {
    try {
      if (!socket.data?.user) {
        console.log('socket.id', socket.id);
        this.server.to(socket.id).emit('401', '401');
        return;
      }
      this.conversationService
        .createConversation(socket.data?.user, friend)
        .pipe(take(1))
        .subscribe(() => {
          // this.getConversations(socket, socket.data?.user?.id);
        });
    } catch (e) {

    }
  }

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: number) {
    this.conversationService
      .joinConversation(friendId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeConversation: ActiveConversationEntity) => {
          this.conversationService
            .getMessages(activeConversation.conversationId)
            .pipe(take(1))
            .subscribe((messages: MessageEntity[]) => {
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

  //Cron
  @Cron('*/5 0 * * * *', {
    name: 'cronSW',
  })
  cronSW() {
    this.logger.debug('cronSW: ' + Date.now());
    this.server.emit('cronSW', 'cronSW');
    // this.server.socketsJoin('room')
    this.server.to('room').emit('roomq', 'roomq');
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

  // @UseInterceptors(new TransformInterceptor())
  @UseFilters(new AllExceptionsFilter())
  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    this.server.to('abc');
    this.server.socketsJoin('abc');
    this.server.engine.join('abc')
    this.server.of('abc').to('abc')
    this.server.local.to('abc')
    //this.server.
    throw new WsException('Invalid credentials.');
    return data;
  }

  @SubscribeMessage('createRoom')
  createRoom(socket: Socket, data: string): WsResponse<unknown> {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', {room: 'aRoom'});
    return { event: 'roomCreated', data: 'aRoom' };
  }

  @SubscribeMessage('createRoom')
  leaveRoom(socket: Socket, data: string): WsResponse<unknown> {
    socket.leave('aRoom');
    socket.to('aRoom').emit('leaveRoom', {room: 'leaveRoom'});
    return { event: 'leaveRoom', data: 'aRoom' };
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room) {
    console.log('Join Room')
    socket.join('aRoom');
    // socket.broadcast.emit('pingROm', {room: 'pingROm'});
    // socket.emit('pingROm', {room: 'pingROm'});
    this.server.in('aRoom').emit('pingROm', {room: 'pingROm'});
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {

  }

  @SubscribeMessage('msgToServer')
  // handleMsg(client: Socket, text: string): WsResponse<string> {
  //   return {
  //     event: 'msgToClient',
  //     data: 'Hello Client'
  //   }
  // }
  handleMsg(client: Socket, text: string): void {
    client.emit('msgToClient', 'Hello Client')
  }
}
