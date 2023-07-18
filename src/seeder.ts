import { seeder } from 'nestjs-seeder';
import { ProductsSeeder } from './products/products.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATA_BASE_CONFIG } from './config/configuration';
import { Product } from './products/entities/product.entity';

seeder({
  imports: [
    TypeOrmModule.forRoot(DATA_BASE_CONFIG),
    TypeOrmModule.forFeature([Product]),
  ],
}).run([ProductsSeeder]);
