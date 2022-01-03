import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpService,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventPattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private httpService: HttpService,
  ) {}
  @Get('')
  all() {
    return 'all pro';
  }

  @Post('')
  @UsePipes(ValidationPipe)
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Get(':id')
  find(@Param('id') id: number) {
    return this.productService.find(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.destroy(id);
  }

  @Post(':id/like')
  async like(@Param('id') id: number) {
    const product = await this.productService.find(id);
    this.httpService
      .post(`http://127.0.0.1:4001/products/${id}/like`, {})
      .subscribe((res) => {
        console.log({ res });
      });
    return await this.productService.update(id, {
      likes: product.likes++,
    });
  }

  /**
   * Listen Microservice Data
   * @param data
   */
  @EventPattern('hello')
  async hello(data: string) {
    console.log({ data });
  }

  @EventPattern('product_created')
  async productCreated(product) {
    await this.productService.create(product);
  }

  @EventPattern('product_updated')
  async productUpdated(product) {
    await this.productService.update(product.id, product);
  }

  @EventPattern('product_deleted')
  async productDeleted(id: number) {
    await this.productService.destroy(id);
  }
}
