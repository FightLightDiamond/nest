import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Res,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterReqDto } from './dto/register.req.dto';
import { SETTING } from '../app.utils';
import { User } from './user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from '../_app/helpers/image-storage';
import { Observable, of, switchMap } from 'rxjs';
const path = require('path');
import { UpdateResult } from 'typeorm';
import { FriendRequest } from '../connect/friend-request.entity';
import {
  IFriendRequestInterface,
  IFriendRequestStatus,
  TFriendRequestStatus,
} from '../connect/friend-request.interface';

@Controller('user')
/**
 * User Controller
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Do User Registration
   * @param registerBody
   */
  @Post('/register')
  // @UsePipes(ValidationPipe)
  async doUserRegistration(
    @Body(SETTING.VALIDATION_PIPE)
    registerBody: RegisterReqDto,
  ): Promise<User> {
    return await this.userService.doUserRegistration(registerBody);
  }

  /**
   * Update Image
   * @param file
   * @param req
   */
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  updateImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<UpdateResult | { error: string }> {
    const fileName = file?.filename;
    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = path.join(process.cwd(), 'images');
    const fullImagePath = path.join(imagesFolderPath + '/' + file.filename);

    if (isFileExtensionSafe(fullImagePath)) {
      const userId = req.user.id;
      return this.userService.updateUserImageById(userId, fileName);
    }
    removeFile(fullImagePath);
    return of({ error: 'File content does not match extension!' });
  }

  /**
   * Find Image
   * @param req
   * @param res
   */
  @UseGuards(JwtGuard)
  @Get('images')
  findImage(@Request() req, @Res() res): Observable<string> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserid(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  /**
   * Send Friend Request
   * @param receiverId
   * @param req
   */
  @UseGuards(JwtGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverId: string,
    @Request() req,
  ): Observable<FriendRequest | { error: string }> {
    return this.userService.sendFriendRequest(parseInt(receiverId), req.user);
  }

  /**
   * Get Friend Request Status
   * @param receiverId
   * @param req
   */
  @UseGuards(JwtGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverId: string,
    @Request() req,
  ): Observable<IFriendRequestStatus | { error: string }> {
    return this.userService.getFriendRequest(parseInt(receiverId), req.user);
  }

  /**
   * Get Me Friend Request Status
   * @param req
   */
  @UseGuards(JwtGuard)
  @Get('friend-request/me')
  getMeFriendRequestStatus(
    @Request() req,
  ): Observable<IFriendRequestInterface[] | { error: string }> {
    return this.userService.getMeFriendRequest(req.user);
  }

  /**
   * Respond Friend Request Status
   * @param friendRequestId
   * @param status
   */
  @UseGuards(JwtGuard)
  @Put('friend-request/response/:friendRequestId')
  respondFriendRequestStatus(
    @Param('friendRequestId') friendRequestId: string,
    @Body('status') status: TFriendRequestStatus,
  ): Observable<UpdateResult | { error: string }> {
    return this.userService.updateFriendRequest(
      parseInt(friendRequestId),
      status,
    );
  }
}
