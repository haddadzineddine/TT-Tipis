import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FindOneByCondition } from './types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name } = createProductDto;
    await this.isNameAlreadyExists(name);

    return await this.productsRepository.save(createProductDto);
  }

  async findAll() {
    return await this.productsRepository.find();
  }

  async findOneBy(conditions: FindOneByCondition) {
    return await this.productsRepository.findOneBy(conditions);
  }

  async findOneByOrFail(conditions: FindOneByCondition) {
    const product = await this.findOneBy(conditions);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOneByOrFail({ id: id });
    await this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    await this.findOneByOrFail({ id: id });
    await this.productsRepository.delete(id);
  }

  private async isNameAlreadyExists(name: string) {
    const product = await this.findOneBy({ name: name });

    if (product) {
      throw new HttpException(
        `Product with this name ${name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }
}
