import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusValues } from './types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private OrderItem: Repository<OrderItem>,
    private productsService: ProductsService,
    private stocksService: StocksService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, customerName, customerEmail } = createOrderDto;

    const orderItems = await this.createOrderItems(items);

    await this.OrderItem.save(orderItems.items);

    return await this.ordersRepository.save({
      customerName,
      customerEmail,
      totalPrice: orderItems.totalPrice,
      items: orderItems.items,
    });
  }

  findAll() {
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    this.ordersRepository.delete(id);
  }

  async addProduct(orderId: number, createOrderItemDto: CreateOrderItemDto) {
    const { productId, quantity } = createOrderItemDto;

    await this.validateProductAvailability(+productId, +quantity);

    const [order, product] = await Promise.all([
      this.findOne(orderId),
      this.productsService.findOne(productId),
    ]);

    const orderItem = await this.OrderItem.findOne({
      where: {
        order: { id: orderId },
        product: { id: productId },
      },
    });

    if (orderItem) {
      // If the order item exists, update the quantity
      await this.OrderItem.update(orderItem.id, {
        quantity: orderItem.quantity + quantity,
      });
    } else {
      // If the order item does not exist, save a new one
      await this.OrderItem.save({
        order,
        product,
        quantity,
      });
    }

    await this.ordersRepository.update(orderId, {
      totalPrice: order.totalPrice + product.price * quantity,
    });

    await this.stocksService.decreaseProductQuantity(+productId, +quantity);
  }

  async removeProduct(orderId: number, productId: number) {
    const [order, product] = await Promise.all([
      this.findOne(orderId),
      this.productsService.findOne(productId),
    ]);

    const orderItem = await this.OrderItem.findOne({
      where: {
        order: { id: orderId },
        product: { id: productId },
      },
    });

    if (!orderItem) {
      throw new HttpException('The product is not in the order', 400);
    }

    await this.OrderItem.delete(orderItem.id);
    await this.stocksService.increaseProductQuantity(
      productId,
      orderItem.quantity,
    );

    // if items is empty, delete the order
    if (order.items.length === 1) {
      await this.remove(orderId);
      return;
    }

    await this.ordersRepository.update(orderId, {
      totalPrice: order.totalPrice - product.price * orderItem.quantity,
    });
  }

  async trackOrder(orderId: number) {
    const order = await this.findOne(orderId);

    return order.status;
  }

  async updateStatus(orderId: number, status: OrderStatusValues) {
    const order = await this.findOne(orderId);

    await this.ordersRepository.update(order.id, {
      status,
    });
  }

  private async validateProductAvailability(
    productId: number,
    quantity: number,
  ) {
    const isAvailable = await this.stocksService.isProductQuantityAvailable(
      productId,
      quantity,
    );

    if (!isAvailable) {
      throw new HttpException(
        `Product with id ${productId} is not available in the desired quantity`,
        400,
      );
    }
  }

  private async createOrderItems(items: CreateOrderItemDto[]) {
    const orderItems = {
      totalPrice: 0,
      items: [],
    };

    for (const item of items) {
      const productId = +item.productId;
      const quantity = +item.quantity;

      await this.validateProductAvailability(productId, quantity);

      const product = await this.productsService.findOne(productId);

      const orderItem = {
        product,
        quantity,
      };

      orderItems.totalPrice += product.price * quantity;

      // if the last item is the same product, sum the quantities
      const lastItem = orderItems.items[orderItems.items.length - 1];

      if (lastItem && lastItem.product.id === productId) {
        lastItem.quantity += quantity;
      } else {
        orderItems.items.push(orderItem);
      }

      await this.stocksService.decreaseProductQuantity(productId, quantity);
    }

    return orderItems;
  }
}
