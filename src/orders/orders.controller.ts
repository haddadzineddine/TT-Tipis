import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import { sendResponse } from 'src/helpers';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@ApiTags('Orders APIs')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const { id } = await this.ordersService.create(createOrderDto);
    return sendResponse(
      'Order created successfully',
      { id },
      HttpStatus.CREATED,
    );
  }

  @Post('add-product/:id')
  async addProduct(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @Param('id') orderId: number,
  ) {
    await this.ordersService.addProduct(orderId, createOrderItemDto);

    return sendResponse(
      'Product added to order successfully',
      null,
      HttpStatus.CREATED,
    );
  }

  @Delete('remove-product/:id/:productId')
  async removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    await this.ordersService.removeProduct(+id, +productId);
    return sendResponse(
      'Product removed from order successfully',
      null,
      HttpStatus.OK,
    );
  }

  @Get()
  async findAll() {
    const orders = await this.ordersService.findAll();
    return sendResponse('Orders fetched successfully', orders, HttpStatus.OK);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    return sendResponse('Order fetched successfully', order, HttpStatus.OK);
  }

  @Get('track/:id')
  async trackOrder(@Param('id') id: string) {
    const orderStatus = await this.ordersService.trackOrder(+id);
    return sendResponse(
      'Order fetched successfully',
      { orderStatus },
      HttpStatus.OK,
    );
  }

  @Patch('update-status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateOrderStatusDto,
  ) {
    await this.ordersService.updateStatus(+id, status);
    return sendResponse(
      'Order status updated successfully',
      null,
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(+id);
    return sendResponse('Order deleted successfully', null, HttpStatus.OK);
  }
}
