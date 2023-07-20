import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Factory } from 'nestjs-seeder';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory((faker) => faker.commerce.productName())
  @Column({ length: 500, unique: true })
  name: string;

  @Factory((faker) => faker.commerce.price())
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Factory((faker) => faker.commerce.productDescription())
  @Column('text')
  description: string;

  @Factory((faker) => faker.commerce.productAdjective())
  @Column({ length: 500 })
  category: string;

  @Factory((faker) => faker.image.url())
  @Column({ default: 'https://picsum.photos/200/300' })
  image: string;

  @Factory(() => Math.floor(Math.random() * 100))
  @Column('int')
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
