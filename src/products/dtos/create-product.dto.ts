import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  category: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
