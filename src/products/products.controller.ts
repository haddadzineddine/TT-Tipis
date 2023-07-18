import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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
  async create(@Body() createProductDto: CreateProductDto) {
    const { id } = await this.productsService.create(createProductDto);
    return sendResponse(
      'Product successfully created',
      { id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return sendResponse(
      'Retrieved products successfully',
      products,
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    return sendResponse(
      'Retrieved product successfully',
      product,
      HttpStatus.OK,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(+id, updateProductDto);
    return sendResponse('Product successfully updated', null, HttpStatus.OK);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return sendResponse('Product successfully deleted', null, HttpStatus.OK);
  }
}
