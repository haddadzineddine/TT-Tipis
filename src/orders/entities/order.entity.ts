import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus, OrderStatusValues } from '../types';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  customerName: string;

  @Column({ length: 255 })
  customerEmail: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ enum: OrderStatusValues, default: OrderStatusValues.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @CreateDateColumn()
  orderDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
