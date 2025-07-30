import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from './product.typeorm.repository';
import { ProductTypeOrmEntity } from '../orm/entities/product.typeorm-entity';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { Term } from 'src/product/domain/value-objects/term.value-object';

describe('TypeOrmProductRepository', () => {
  let repository: TypeOrmProductRepository;
  let mockRepository: jest.Mocked<Repository<ProductTypeOrmEntity>>;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmProductRepository,
        {
          provide: getRepositoryToken(ProductTypeOrmEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmProductRepository>(TypeOrmProductRepository);
    mockRepository = module.get(getRepositoryToken(ProductTypeOrmEntity));
  });

  describe('save', () => {
    it('should save a product', async () => {
      const product = new Product(
        '123e4567-e89b-12d3-a456-426614174000',
        'Personal Loan',
        ProductCode.PERSONAL_LOAN,
        Term.fromMonths(24),
        new InterestRate(5.5),
        10000,
      );

      mockRepository.save.mockResolvedValue({} as ProductTypeOrmEntity);

      await repository.save(product);

      expect(mockRepository.save).toHaveBeenCalledWith({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Personal Loan',
        code: ProductCode.PERSONAL_LOAN,
        termMonths: 24,
        interestRate: 5.5,
        sum: 10000,
      });
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      const entity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Personal Loan',
        code: ProductCode.PERSONAL_LOAN,
        termMonths: 24,
        interestRate: 5.5,
        sum: 10000,
      } as ProductTypeOrmEntity;

      mockRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result?.name).toBe('Personal Loan');
      expect(result?.code).toBe(ProductCode.PERSONAL_LOAN);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should return null when product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const entities = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Personal Loan',
          code: ProductCode.PERSONAL_LOAN,
          termMonths: 24,
          interestRate: 5.5,
          sum: 10000,
        },
      ] as ProductTypeOrmEntity[];

      mockRepository.find.mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await repository.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(mockRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
