import { EntityRepository, Repository } from 'typeorm';
import { AuthTokenEntity } from './auth-token.entity';

@EntityRepository(AuthTokenEntity)
export class AuthTokenRepository extends Repository<AuthTokenEntity> {}
