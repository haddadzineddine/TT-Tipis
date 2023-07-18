import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, OrderStatusValues } from '../types';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatusValues, default: OrderStatusValues.PENDING })
  @IsEnum(OrderStatusValues)
  status: OrderStatus;
}
