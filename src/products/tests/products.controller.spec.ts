import { sendResponse } from './../../helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { mockProductService, mockProducts } from './mocks';
import { CreateProductDto } from '../dtos/create-product.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Products', () => {
    it('should return an array of products', async () => {
      await expect(controller.findAll()).resolves.toEqual(
        sendResponse('Retrieved products successfully', mockProducts),
      );
    });
  });

  describe('get Product By Id', () => {
    it('should return a single product', async () => {
      await expect(controller.findOne(1)).resolves.toEqual(
        sendResponse('Retrieved product successfully', mockProducts[0]),
      );
    });
  });

  describe('create Product', () => {
    it('should create a product', async () => {
      const newProduct: CreateProductDto = {
        name: 'Silver Bacon',
        description:
          'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
        category: 'Sleek',
        price: 39,
        quantity: 1,
      };

      await expect(controller.create(newProduct)).resolves.toEqual(
        sendResponse('Product successfully created', { id: 4 }),
      );
    });

    it('should throw an error if product name is not provided', async () => {
      const newProduct: CreateProductDto = {
        name: '',
        description:
          'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
        category: 'Sleek',
        price: 39,
        quantity: 1,
      };

      const createProductDto = plainToInstance(CreateProductDto, newProduct);

      const errors = await validate(createProductDto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints.minLength).toEqual(
        'name must be longer than or equal to 3 characters',
      );
    });
  });

  describe('update Product', () => {
    it('should update a product', async () => {
      const updatedProduct = mockProducts[0];
      await expect(controller.update(1, updatedProduct)).resolves.toEqual(
        sendResponse('Product successfully updated', null),
      );
    });
  });

  describe('delete Product', () => {
    it('should delete a product', async () => {
      await expect(controller.remove(1)).resolves.toEqual(
        sendResponse('Product successfully deleted', null),
      );
    });
  });
});
