import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { FriendRequestRepository } from '../connect/friend-request.repository';
import { UserResolver } from './user.resolver';
import {ConfirmEmailService} from "./email/confirmEmail.service";
import {JwtModule} from "@nestjs/jwt";
import {jwtConfigAsync} from "../config/jwt.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, FriendRequestRepository]),
    JwtModule.registerAsync(jwtConfigAsync),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    ConfirmEmailService
  ],
  exports: [UserService],
})
export class UserModule {}
