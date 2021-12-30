import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokenService } from '../auth-token/auth-token.service';

/**
 * Jwt Strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param configService
   * @param authTokenService
   */
  constructor(
    configService: ConfigService,
    private readonly authTokenService: AuthTokenService, // private context: ExecutionContext,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // algorithms: ['HS256'],
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // secretOrKey: 'jwtsecret@123',
      passReqToCallback: true,
    });
  }

  /**
   * validate
   * @param req
   * @param payload
   */
  async validate(@Request() req, payload) {
    const { user } = payload;
    debugger;
    const bearerToken = req.header('authorization');
    const token = bearerToken.replace('Bearer ', '');
    const authToken = await this.authTokenService.find({
      token,
      userId: user.id,
    });

    if (!authToken) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
