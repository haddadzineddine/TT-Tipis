import { HttpException, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StocksService {
  constructor(private productsService: ProductsService) {}

  async isProductQuantityAvailable(
    productId: number,
    quantity: number,
  ): Promise<boolean> {
    const product = await this.productsService.findOne(productId);
    return product.quantity >= quantity;
  }

  async decreaseProductQuantity(
    productId: number,
    quantity: number,
  ): Promise<void> {
    const product = await this.productsService.findOne(productId);

    if (product.quantity < quantity) {
      throw new HttpException(
        `You can't decrease product with id ${productId} quantity by ${quantity} because it's quantity is less than ${quantity}`,
        400,
      );
    }

    product.quantity -= quantity;

    await this.productsService.update(productId, product);
  }

  async increaseProductQuantity(
    productId: number,
    quantity: number,
  ): Promise<void> {
    const product = await this.productsService.findOne(productId);
    product.quantity += quantity;

    await this.productsService.update(productId, product);
  }
}
