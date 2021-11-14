import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_RULE =
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
  'Password should have 1 upper case, lowercase letter along with a number and special character';
const CONFIRMATION_PASSWORD_RULE_MESSAGE =
  'Confirmation password should have 1 upper case, lowercase letter along with a number and special character';

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGE = {
  PASSWORD_RULE_MESSAGE,
  CONFIRMATION_PASSWORD_RULE_MESSAGE,
};

export const SETTING = {
  VALIDATION_PIPE,
};
