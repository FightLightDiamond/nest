import {Global, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigAsync } from '../config/jwt.config';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { AuthTokenService } from './auth-token/auth-token.service';
import { AuthTokenRepository } from './auth-token/auth-token.repository';
import {GqlAuthGuard} from "./guards/gqlAuth.guard";

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfigAsync),
    TypeOrmModule.forFeature([UserRepository, AuthTokenRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard, RolesGuard, AuthTokenService, GqlAuthGuard],
  exports: [AuthService, AuthTokenService],
})
export class AuthModule {}
