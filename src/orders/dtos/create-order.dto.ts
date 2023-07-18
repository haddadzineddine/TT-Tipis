import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import {
  ArrayNotEmpty,
  IsEmail,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @Type(() => CreateOrderItemDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  items: CreateOrderItemDto[];
}
