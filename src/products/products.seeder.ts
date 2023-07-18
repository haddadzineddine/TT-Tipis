import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async seed(): Promise<any> {
    const products = DataFactory.createForClass(Product).generate(20);

    return this.productsRepository.save(products);
  }

  async drop(): Promise<any> {
    return this.productsRepository.delete({});
  }
}
