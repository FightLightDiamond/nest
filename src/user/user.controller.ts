import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterReqDto } from './dto/register.req.dto';
import { SETTING } from '../app.utils';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  // @UsePipes(ValidationPipe)
  async doUserRegistration(
    @Body(SETTING.VALIDATION_PIPE)
    registerBody: RegisterReqDto,
  ): Promise<User> {
    return await this.userService.doUserRegistration(registerBody);
  }
}
