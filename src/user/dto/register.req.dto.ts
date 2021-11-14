import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGE, REGEX } from '../../app.utils';

export class RegisterReqDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGE.PASSWORD_RULE_MESSAGE,
  })
  password: string;

  @IsNotEmpty()
  @Length(8, 24)
  // @Matches('password')
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGE.CONFIRMATION_PASSWORD_RULE_MESSAGE,
  })
  confirmation_password: string;
}
