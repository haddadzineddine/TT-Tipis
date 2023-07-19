import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { mockProducts, mockProductRepository } from './mocks';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('get Products', () => {
    it('should return an array of products', async () => {
      await expect(service.findAll()).resolves.toEqual(mockProducts);
    });
  });

  describe('get Product By Id', () => {
    it('should return a single product', async () => {
      await expect(service.findOneByOrFail({ id: 1 })).resolves.toEqual(
        mockProducts[0],
      );
    });

    it('should throw an error if product not found', async () => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.findOneByOrFail({ id: -1 })).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('create Product', () => {
    it('should throw an error if product name already exists', async () => {
      const { id, ...newProduct } = mockProducts[0];

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue({
        ...mockProducts[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(newProduct)).rejects.toThrow(
        new HttpException(
          `Product with this name ${newProduct.name} already exists`,
          HttpStatus.BAD_REQUEST,
        ),
      );
      await expect(productRepository.findOneBy).toHaveBeenCalledWith({
        name: newProduct.name,
      });
    });

    it('should create a product', async () => {
      const newProduct: CreateProductDto = {
        name: 'Silver Bacon Not Already Exists',
        description:
          'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
        category: 'Sleek',
        price: 39,
        quantity: 1,
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      const result = await service.create(newProduct);

      await expect(result).toEqual({ id: 4, ...newProduct });
      await expect(productRepository.save).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('update Product', () => {
    it('should update a product', async () => {
      const { id, ...updatedProductDto } = mockProducts[0];

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue({
        ...mockProducts[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateProduct = await service.update(id, updatedProductDto);

      expect(updateProduct).toEqual(undefined);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(productRepository.update).toBeCalledTimes(1);
      expect(productRepository.update).toHaveBeenCalledWith(
        id,
        updatedProductDto,
      );
    });

    it('should throw an error if product not found', async () => {
      const { id, ...updatedProductDto } = mockProducts[0];
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(id, updatedProductDto)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('delete Product', () => {
    it('should delete a product', async () => {
      const { id } = mockProducts[0];

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue({
        ...mockProducts[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const deletedProduct = await service.remove(id);

      expect(deletedProduct).toEqual(undefined);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(productRepository.delete).toBeCalledTimes(1);
      expect(productRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if product not found', async () => {
      const { id } = mockProducts[0];
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
