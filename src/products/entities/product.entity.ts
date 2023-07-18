import { OrderItem } from 'src/orders/entities/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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

  @Factory(() => Math.floor(Math.random() * 100))
  @Column('int')
  quantity: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
