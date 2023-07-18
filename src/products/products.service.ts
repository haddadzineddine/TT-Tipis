import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name } = createProductDto;
    const product = await this.findByName(name);

    if (product) {
      throw new HttpException('Product with this name already exists', 400);
    }

    return await this.productsRepository.save(createProductDto);
  }

  async findAll() {
    return await this.productsRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id: id });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async findByName(name: string) {
    return await this.productsRepository.findOneBy({ name: name });
  }

  async findAllByIds(ids: number[]) {
    const products = [];

    for (const id of ids) {
      const product = await this.findOne(id);
      products.push(product);
    }

    return products;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
