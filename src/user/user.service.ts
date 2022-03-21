import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { RegisterReqDto } from './dto/register.req.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../connect/friend-request.entity';
import { FriendRequestRepository } from '../connect/friend-request.repository';
import {
  IFriendRequestInterface,
  IFriendRequestStatus,
  TFriendRequestStatus,
} from '../connect/friend-request.interface';
import {SignupInput} from "./input/signup.input";
import {UserInterface} from "./user.interface";
import {ErrorResponse} from "./shared/errorResponse";
import {ConfirmEmailService} from "./email/confirmEmail.service";
// import {redis} from "../redis";
import {LoginInput} from "./input/login.input";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import { Cache } from 'cache-manager';
import {FilesService} from "./files/files.service";
import {PrivateFilesService} from "./files/privateFiles.service";

@Injectable()
/**
 * User Service
 */
export class UserService {
  /**
   * @param userRepository
   * @param friendRequestRepository
   * @param confirmEmailService
   * @param jwtService
   * @param filesService
   * @param privateFilesService
   * @param cacheManager
   */
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(FriendRequestRepository)
    private friendRequestRepository: FriendRequestRepository,
    private confirmEmailService: ConfirmEmailService,
    private jwtService: JwtService,
    private readonly filesService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * Do User Registration
   * @param registerBody
   */
  async doUserRegistration(registerBody: RegisterReqDto): Promise<UserEntity>  {
    const user = new UserEntity();
    // user.name = registerBody.name;
    user.email = registerBody.email;
    user.password = registerBody.password;
    return await user.save();
  }

  /**
   *
   * @param signupInput
   */
  async signup(signupInput: SignupInput): Promise<ErrorResponse[] | null> {
    const userExit = await this.userRepository.findOne({where: {email: signupInput.email}})
    if(userExit) {
      return [
        {
          path: "email",
          message: "invalid email"
        }
      ]
    }
    const user = new UserEntity();
    user.email = signupInput.email
    user.password = signupInput.password
    user.save()
    // const user  = await this.userRepository.save({
    //   ...signupInput
    // })

    await this.confirmEmailService.sent(user.id)

    return null
  }

  async login(loginInput: LoginInput): Promise<ErrorResponse[] | string> {
    const user = await this.userRepository.findOne({where: {email: loginInput.email}})
    if(!user) {
      return [
        {
          path: "email",
          message: "invalid email"
        }
      ]
    }

    console.log({
      loginInput, user
    })

    const checkPassword = await bcrypt.compare(loginInput.password, user.password)

    if(!checkPassword) {
      return [
        {
          path: "password",
          message: "Password invalid"
        }
      ]
    }

    const jwt =  await this.jwtService.signAsync({ user })

    return [
      {
        path: "password",
        message: jwt
      }
    ]
  }

  /**
   * Find User By Id
   * @param id
   */
  findUserById(id: number) {
    return from(this.userRepository.findOne(id, { relations: ['posts'] })).pipe(
      map((user: UserEntity) => {
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
    const user: UserEntity = new UserEntity();
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
    creator: UserEntity,
    receiver: UserEntity,
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
    creator: UserEntity,
  ): Observable<FriendRequestEntity | { error: string }> {
    if (receiverId === creator.id) {
      return of({ error: 'It is not possible to add yourself!' });
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: UserEntity) => {
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
    creator: UserEntity,
  ): Observable<IFriendRequestStatus | { error: string }> {
    if (receiverId === creator.id) {
      return of({ error: 'It is not possible to add yourself!' });
    }

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: UserEntity) => {
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
  getMeFriendRequest(creator: UserEntity): Observable<IFriendRequestInterface[]> {
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
  getFriendRequestUserById(friendRequestId: number): Observable<FriendRequestEntity> {
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
  async getUserByEmail(email: string): Promise<UserInterface>  {
    return await this.userRepository.getUserByEmail(email)
  }

  async confirmEmail(id: string) {
    const userId = await this.cacheManager.get(id)
    if(!userId) {
      throw new NotFoundException()
    }

    if (typeof userId === "string") {
      await this.userRepository.update({id: parseInt(userId)}, {confirmed: true})
    }
    await this.cacheManager.del(id)

    return '0k'
  }

  /**
   * Upload file AWS
   * @param id
   */
  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
    const user = await this.getById(userId);
    await this.userRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null
      });
      await this.filesService.deletePublicFile(fileId)
    }
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFilesService.getPrivateFile(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.userRepository.findOne(
      { id: userId },
      { relations: ['files'] }
    );
    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.privateFilesService.generatePresignedUrl(file.key);
          return {
            ...file,
            url
          }
        })
      )
    }
    throw new NotFoundException('User with this id does not exist');
  }
}
