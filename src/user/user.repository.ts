import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByEmail(email: string): Promise<User> {
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
