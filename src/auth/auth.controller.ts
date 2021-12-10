import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() user: User): Observable<{ token: string }> {
    return this.authService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @Post('logout')
  public logout(): void {
    // req.logout();
    // res.redirect('/api/feed');
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
