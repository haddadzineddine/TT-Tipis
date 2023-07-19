import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { sendResponse } from './../helpers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products APIs')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const { id } = await this.productsService.create(createProductDto);

    return sendResponse('Product successfully created', { id });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const products = await this.productsService.findAll();
    return sendResponse('Retrieved products successfully', products);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    const product = await this.productsService.findOneByOrFail({ id: +id });
    return sendResponse('Retrieved product successfully', product);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(+id, updateProductDto);
    return sendResponse('Product successfully updated', null);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    await this.productsService.remove(+id);
    return sendResponse('Product successfully deleted', null);
  }
}
