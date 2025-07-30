import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './domain/repositories/product.repository';
import { Product } from './domain/entities/product.entity';
import { ProductCode } from './domain/enums/product-code.enum';
import { InterestRate } from './domain/value-objects/interest-rate.value-object';
import { Term } from './domain/value-objects/term.value-object';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'ProductRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    mockRepository = module.get('ProductRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Personal Loan',
        code: ProductCode.PERSONAL_LOAN,
        termMonths: 24,
        interestRate: 5.5,
        sum: 10000,
      };

      mockRepository.save.mockResolvedValue();

      const result = await service.create(createProductDto);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('Personal Loan');
      expect(result.code).toBe(ProductCode.PERSONAL_LOAN);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const product = new Product(
        '123',
        'Personal Loan',
        ProductCode.PERSONAL_LOAN,
        Term.fromMonths(24),
        new InterestRate(5.5),
        10000,
      );

      mockRepository.findById.mockResolvedValue(product);

      const result = await service.findOne('123');

      expect(result).toBe(product);
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [
        new Product(
          '123',
          'Personal Loan',
          ProductCode.PERSONAL_LOAN,
          Term.fromMonths(24),
          new InterestRate(5.5),
          10000,
        ),
      ];

      mockRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toBe(products);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = '123';
      const existingProduct = new Product(
        productId,
        'Personal Loan',
        ProductCode.PERSONAL_LOAN,
        Term.fromMonths(24),
        new InterestRate(5.5),
        10000,
      );

      const updateProductDto = {
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

      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.save.mockResolvedValue();

      const result = await service.update(productId, updateProductDto);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('Updated Personal Loan');
      expect(result.interestRate.value).toBe(6.0);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Product));
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      const productId = 'non-existent';
      const updateProductDto = {
        name: 'Updated Personal Loan',
      };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(productId, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const product = new Product(
        '123',
        'Personal Loan',
        ProductCode.PERSONAL_LOAN,
        Term.fromMonths(24),
        new InterestRate(5.5),
        10000,
      );

      mockRepository.findById.mockResolvedValue(product);
      mockRepository.delete.mockResolvedValue();

      await service.remove('123');

      expect(mockRepository.delete).toHaveBeenCalledWith('123');
    });
  });
});
