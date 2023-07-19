import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  HttpCode,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { sendResponse } from 'src/helpers';
import { ApiTags } from '@nestjs/swagger';
import { ProductQuantityDto } from './dtos/product-qunatity.dto';

@ApiTags('Stock APIs')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('is-product-quantity-available')
  @HttpCode(HttpStatus.OK)
  async isProductQuantityAvailable(
    @Query() { productId, quantity }: ProductQuantityDto,
  ) {
    const isAvailable = await this.stocksService.isProductQuantityAvailable(
      productId,
      quantity,
    );
    return sendResponse('Product quantity availability checked successfully', {
      isAvailable,
    });
  }

  @Post('decrease-product-quantity')
  @HttpCode(HttpStatus.OK)
  async decreaseProductQuantity(
    @Body() { productId, quantity }: ProductQuantityDto,
  ) {
    await this.stocksService.decreaseProductQuantity(productId, quantity);
    return sendResponse('Product quantity decreased successfully', null);
  }

  @Post('increase-product-quantity')
  @HttpCode(HttpStatus.OK)
  async increaseProductQuantity(
    @Body() { productId, quantity }: ProductQuantityDto,
  ) {
    await this.stocksService.increaseProductQuantity(productId, quantity);
    return sendResponse('Product quantity increased successfully', null);
  }
}
