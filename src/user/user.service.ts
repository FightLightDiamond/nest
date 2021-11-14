import { Injectable } from '@nestjs/common';
import { RegisterReqDto } from './dto/register.req.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async doUserRegistration(registerBody: RegisterReqDto): Promise<User> {
    const user = new User();
    user.name = registerBody.name;
    user.email = registerBody.email;
    user.password = registerBody.password;
    return await user.save();
  }
}
