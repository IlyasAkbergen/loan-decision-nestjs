import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './domain/repositories/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './domain/entities/product.entity';
import { ProductCode } from './domain/enums/product-code.enum';
import { InterestRate } from './domain/value-objects/interest-rate.value-object';
import { Term } from './domain/value-objects/term.value-object';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;

  const mockProduct = new Product(
    '123e4567-e89b-12d3-a456-426614174000',
    'Personal Loan',
    ProductCode.PERSONAL_LOAN,
    Term.fromMonths(24),
    new InterestRate(5.5),
    10000,
  );

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: 'ProductRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    mockRepository = module.get('ProductRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Personal Loan',
        code: ProductCode.PERSONAL_LOAN,
        termMonths: 24,
        interestRate: 5.5,
        sum: 10000,
      };

      mockRepository.save.mockResolvedValue(undefined);
      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toBe(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      
      mockRepository.findAll.mockResolvedValue(products);
      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toBe(products);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      const products: Product[] = [];
      
      mockRepository.findAll.mockResolvedValue(products);
      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockRepository.findById.mockResolvedValue(mockProduct);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await controller.findOne(productId);

      expect(result).toBe(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`Product with ID ${productId} not found`));

      await expect(controller.findOne(productId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Personal Loan',
        interestRate: 6.0,
      };

      const updatedProduct = new Product(
        productId,
        'Updated Personal Loan',
        ProductCode.PERSONAL_LOAN,
        Term.fromMonths(24),
        new InterestRate(6.0),
        10000,
      );

      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(undefined);
      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, updateProductDto);

      expect(result).toBe(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      const productId = 'non-existent-id';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Personal Loan',
      };

      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`Product with ID ${productId} not found`));

      await expect(controller.update(productId, updateProductDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(productId, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.delete.mockResolvedValue(undefined);
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(productId);

      expect(service.remove).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      const productId = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`Product with ID ${productId} not found`));

      await expect(controller.remove(productId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(productId);
    });
  });
});
