import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import AddressEntity from "./address.entity";

@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity>  {
  async getUserByEmail(email: string): Promise<AddressEntity>  {
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
