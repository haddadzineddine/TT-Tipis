import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber, Min, ValidateIf } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
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
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsString()
  @ValidateIf((o) => o.image !== null)
  image: string | null;
}
