import { Injectable } from '@nestjs/common';
import { RegisterReqDto } from './dto/register.req.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { FriendRequest } from '../connect/friend-request.entity';
import { FriendRequestRepository } from '../connect/friend-request.repository';
import {
  IFriendRequestInterface,
  IFriendRequestStatus,
  TFriendRequestStatus,
} from '../connect/friend-request.interface';

@Injectable()
/**
 * User Service
 */
export class UserService {
  /**
   * @param userRepository
   * @param friendRequestRepository
   */
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(FriendRequestRepository)
    private friendRequestRepository: FriendRequestRepository,
  ) {}

  /**
   * Do User Registration
   * @param registerBody
   */
  async doUserRegistration(registerBody: RegisterReqDto): Promise<User> {
    const user = new User();
    // user.name = registerBody.name;
    user.email = registerBody.email;
    user.password = registerBody.password;
    return await user.save();
  }

  /**
   * Find User By Id
   * @param id
   */
  findUserById(id: number) {
    return from(this.userRepository.findOne(id, { relations: ['posts'] })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  /**
   * Update User Image By Id
   * @param id
   * @param imagePath
   */
  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new User();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  /**
   * Find Image Name By User Id
   * @param id
   */
  findImageNameByUserid(id: number): Observable<string> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user) => {
        return user.imagePath;
      }),
    );
  }

  /**
   * Has Request Been Sent Or Received
   * @param creator
   * @param receiver
   */
  hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest) => {
        return of(!!friendRequest);
      }),
    );
  }

  /**
   * Send Friend Request
   * @param receiverId
   * @param creator
   */
  sendFriendRequest(
    receiverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id) {
      return of({ error: 'It is not possible to add yourself!' });
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrReceived(receiver, creator).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              return of({
                error:
                  'A friend request has already been sent of received to your account',
              });
            return this.friendRequestRepository.save({
              creator,
              receiver,
              status: 'pending',
            });
          }),
        );
        // if (this.hasRequestBeenSentOrReceived(receiver, creator)) {
        //   return this.friendRequestRepository.save({
        //     creator,
        //     receiverId,
        //   });
        // }
      }),
    );
  }

  /**
   * Get Friend Request
   * @param receiverId
   * @param creator
   */
  getFriendRequest(
    receiverId: number,
    creator: User,
  ): Observable<IFriendRequestStatus | { error: string }> {
    if (receiverId === creator.id) {
      return of({ error: 'It is not possible to add yourself!' });
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            where: [
              { creator, receiver },
              { creator: receiver, receiver: creator },
            ],
          }),
        ).pipe(
          switchMap((friendRequest) => {
            if (!friendRequest) return of({ error: 'Not Found' });
            return of({ status: friendRequest.status });
          }),
        );
      }),
    );
  }

  /**
   * Get Me Friend Request
   * @param creator
   */
  getMeFriendRequest(creator: User): Observable<IFriendRequestInterface[]> {
    return from(
      this.friendRequestRepository.find({
        where: [{ creator }, { receiver: creator }],
      }),
    );
  }

  /**
   * Get Friend Request User By Id
   * @param friendRequestId
   */
  getFriendRequestUserById(friendRequestId: number): Observable<FriendRequest> {
    return from(this.friendRequestRepository.findOne(friendRequestId));
  }

  /**
   * Update Friend Request
   * @param friendRequestId
   * @param status
   */
  updateFriendRequest(
    friendRequestId: number,
    status: TFriendRequestStatus,
  ): Observable<UpdateResult | { error: string }> {
    return from(
      this.getFriendRequestUserById(friendRequestId).pipe(
        switchMap((friendRequest) => {
          if (!friendRequest) return of({ error: 'not found' });
          return from(
            this.friendRequestRepository.update(friendRequestId, {
              status,
            }),
          );
          // return from(
          //   this.friendRequestRepository.save({
          //     ...friendRequest,
          //     status,
          //   }),
          // );
        }),
      ),
    );
  }

  /**
   * Get User By Email
   * @param email
   */
  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.getUserByEmail(email);
  }
}
