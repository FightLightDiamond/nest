import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { FriendRequestRepository } from '../connect/friend-request.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, FriendRequestRepository]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
