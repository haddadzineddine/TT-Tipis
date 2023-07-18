import { ApiProperty } from '@nestjs/swagger';

export class ProductQuantityDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}
