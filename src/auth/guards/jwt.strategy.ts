import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // algorithms: ['HS256'],
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // secretOrKey: 'jwtsecret@123',
    });
  }

  async validate(payload: any) {
    debugger;
    return { ...payload.user };
  }
}
