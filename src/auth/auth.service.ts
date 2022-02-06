import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../user/user.interface';
import { AuthTokenService } from './auth-token/auth-token.service';

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  /**
   * Login
   * @param user
   */
  login(user: UserEntity): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: UserEntity) => {
        if (user) {
          return from(this.jwtService.signAsync({ user })).pipe(
            map((jwt) => {
              this.authTokenService.create({
                userId: user.id,
                token: jwt,
              });
              return jwt;
            }),
          );
        }
      }),
    );
  }

  /**
   * Validate User
   * @param email
   * @param password
   */
  validateUser(email: string, password: string): Observable<UserEntity>  {
    return from(
      this.userRepository.findOne(
        { email },
        {
          select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
        },
      ),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user) {
          // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
          );
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
            return null;
          }),
        );
      }),
    );
  }

  getJwtUser(jwt: string): Observable<UserInterface | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: UserInterface }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
