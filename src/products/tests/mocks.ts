import { CreateProductDto } from '../dtos/create-product.dto';
import { FindOneByCondition } from '../types';

export const mockProducts = [
  {
    id: 1,
    name: 'Rustic Granite Bacon',
    price: 39,
    description:
      'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    category: 'Sleek',
    quantity: 7,
  },
  {
    id: 2,
    name: 'Handcrafted Cotton Keyboard',
    price: 274,
    description: 'Handcrafted Cotton Keyboard',
    category: 'Health',
    quantity: 10,
  },
  {
    id: 3,
    name: 'Luxurious Steel Pizza',
    price: 527,
    description:
      'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    category: 'Gorgeous',
    quantity: 19,
  },
];

export const mockProductService = {
  findAll: jest.fn().mockResolvedValue(mockProducts),

  findOneByOrFail: jest.fn().mockImplementation((_condition: FindOneByCondition) => {
    return Promise.resolve(mockProducts[0]);
  }),

  create: jest
    .fn()
    .mockImplementation(async (createProductDto: CreateProductDto) => {
      return Promise.resolve({
        id: 4,
        ...createProductDto,
      });
    }),

  update: jest
    .fn()
    .mockImplementation((_id: number, _updateProductDto: CreateProductDto) => {
      return Promise.resolve();
    }),

  remove: jest.fn().mockImplementation((_id: number) => {
    return Promise.resolve();
  }),
};

export const mockProductRepository = {
  find: jest.fn().mockResolvedValue(mockProducts),

  findOneBy: jest.fn().mockImplementation((_conditions: FindOneByCondition) => {
    return Promise.resolve(mockProducts[0]);
  }),

  save: jest
    .fn()
    .mockImplementation(async (createProductDto: CreateProductDto) => {
      return Promise.resolve({
        id: 4,
        ...createProductDto,
      });
    }),

  update: jest
    .fn()
    .mockImplementation((_id: number, _updateProductDto: CreateProductDto) => {
      return Promise.resolve();
    }),

  delete: jest.fn().mockImplementation((_id: number) => {
    return Promise.resolve();
  }),
};
