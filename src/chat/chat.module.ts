import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigAsync } from '../config/jwt.config';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';
import { ActiveConversationService } from './active-conversation/active-conversation.service';
import { AuthModule } from '../auth/auth.module';
import { ActiveConversationRepository } from './active-conversation/active-conversaction.repository';
import { ConversationRepository } from './conversation/conversation.repository';
import { MessageRepository } from './message/message.repository';
import {AlertGateway} from "./alert.gateway";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfigAsync),
    UserModule,
    TypeOrmModule.forFeature([
      ActiveConversationRepository,
      ConversationRepository,
      MessageRepository,
    ]),
    AuthModule,
  ],
  providers: [
    //gateway

    ChatGateway,
    AlertGateway,
    MessageService,
    ConversationService,
    ActiveConversationService,
  ],
})
export class ChatModule {}
