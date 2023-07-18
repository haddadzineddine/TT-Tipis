import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { sendResponse } from 'src/helpers';
import { ApiTags } from '@nestjs/swagger';
import { ProductQuantityDto } from './dto/product-qunatity.dto';

@ApiTags('Stock APIs')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('is-product-quantity-available')
  async isProductQuantityAvailable(
    @Query() { productId, quantity }: ProductQuantityDto,
  ) {
    const isAvailable = await this.stocksService.isProductQuantityAvailable(
      productId,
      quantity,
    );
    return sendResponse(
      'Product quantity availability checked successfully',
      { isAvailable },
      HttpStatus.OK,
    );
  }

  @Post('decrease-product-quantity')
  async decreaseProductQuantity(
    @Body() { productId, quantity }: ProductQuantityDto,
  ) {
    await this.stocksService.decreaseProductQuantity(productId, quantity);
    return sendResponse(
      'Product quantity decreased successfully',
      null,
      HttpStatus.OK,
    );
  }

  @Post('increase-product-quantity')
  async increaseProductQuantity(
    @Body() { productId, quantity }: ProductQuantityDto,
  ) {
    await this.stocksService.increaseProductQuantity(productId, quantity);
    return sendResponse(
      'Product quantity increased successfully',
      null,
      HttpStatus.OK,
    );
  }
}
