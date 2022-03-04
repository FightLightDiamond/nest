import {CacheModule, Global, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { FriendRequestRepository } from '../connect/friend-request.repository';
import { UserResolver } from './user.resolver';
import {ConfirmEmailService} from "./email/confirmEmail.service";
import {JwtModule} from "@nestjs/jwt";
import {jwtConfigAsync} from "../config/jwt.config";
import {AddressRepository} from "./address/address.repository";
import {AddressService} from "./address/address.service";
import {AddressController} from "./address/address.controller";

@Global()
@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([UserRepository, FriendRequestRepository, AddressRepository]),
    JwtModule.registerAsync(jwtConfigAsync),
  ],
  controllers: [UserController, AddressController],
  providers: [
    UserService,
    AddressService,
    UserResolver,
    ConfirmEmailService
  ],
  exports: [UserService, AddressService],
})
export class UserModule {}
