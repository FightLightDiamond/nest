import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>  {
  async getUserByEmail(email: string): Promise<UserEntity>  {
    return await this.findOne({
      where: { email: email },
    }).then((entity) => {
      if (!entity) {
        return Promise.reject(new NotFoundException('Model not found'));
      }

      return Promise.resolve(entity);
    });
  }
}
