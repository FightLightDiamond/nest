import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async all() {
    return await this.productRepository.find();
  }

  async create(body) {
    return await this.productRepository.save(body);
  }

  async find(id: number) {
    return await this.productRepository.findOne(id);
  }

  async update(id: number, body) {
    return await this.productRepository.update(id, body);
  }

  async destroy(id: number) {
    return await this.productRepository.delete(id);
  }
}
