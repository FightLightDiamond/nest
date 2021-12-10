import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestRepository } from './friend-request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestRepository])],
  // exports: [
  //   FriendRequestRepository,
  //   TypeOrmModule.forFeature([FriendRequestRepository]),
  // ],
})
export class ConnectModule {}
