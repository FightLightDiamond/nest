import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokenRepository } from './auth-token.repository';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthTokenRepository)
    private authTokenRepository: AuthTokenRepository,
  ) {}

  async find(req) {
    return await this.authTokenRepository.findOne(req);
  }

  async create(req) {
    await this.authTokenRepository.save(req);
  }

  async delete(req) {
    await this.authTokenRepository.delete(req);
  }
}
