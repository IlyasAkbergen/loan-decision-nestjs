import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProductController } from '../src/product/product.controller';
import { ProductService } from '../src/product/product.service';
import { ProductCode } from '../src/product/domain/enums/product-code.enum';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { UpdateProductDto } from '../src/product/dto/update-product.dto';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  const mockRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: 'ProductRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/products (POST)', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Personal Loan',
        code: ProductCode.PERSONAL_LOAN,
        termMonths: 24,
        interestRate: 5.5,
        sum: 10000,
      };

      mockRepository.save.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Personal Loan');
      expect(response.body.code).toBe(ProductCode.PERSONAL_LOAN);
      expect(response.body.sum).toBe(10000);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid product data', async () => {
      const invalidProductDto = {
        name: '', // invalid: empty string
        code: 'INVALID_CODE', // invalid: not in enum
        termMonths: -1, // invalid: negative
        interestRate: 150, // invalid: > 100
        sum: -1000, // invalid: negative
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(invalidProductDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteProductDto = {
        name: 'Personal Loan',
        // missing required fields
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(incompleteProductDto)
        .expect(400);
    });
  });

  describe('/products (GET)', () => {
    it('should return all products', async () => {
      const mockProducts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Personal Loan',
          code: ProductCode.PERSONAL_LOAN,
          term: { months: 24 },
          interestRate: { value: 5.5 },
          sum: 10000,
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Business Loan',
          code: ProductCode.PERSONAL_LOAN,
          term: { months: 36 },
          interestRate: { value: 6.0 },
          sum: 50000,
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockProducts);

      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('/products/:id (GET)', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const mockProduct = {
      id: productId,
      name: 'Personal Loan',
      code: ProductCode.PERSONAL_LOAN,
      term: { months: 24 },
      interestRate: { value: 5.5 },
      sum: 10000,
    };

    it('should return a product by id', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('Personal Loan');
      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
    });

    it('should return 404 when product not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get(`/products/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/products/:id (PATCH)', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const existingProduct = {
      id: productId,
      name: 'Personal Loan',
      code: ProductCode.PERSONAL_LOAN,
      term: { months: 24 },
      interestRate: { value: 5.5 },
      sum: 10000,
    };

    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Personal Loan',
        interestRate: 6.0,
      };

      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.save.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updateProductDto)
        .expect(200);

      expect(response.body.name).toBe('Updated Personal Loan');
      expect(response.body.interestRate.value).toBe(6.0);
      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent product', async () => {
      const nonExistentId = 'non-existent-id';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Personal Loan',
      };

      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch(`/products/${nonExistentId}`)
        .send(updateProductDto)
        .expect(404);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidUpdateDto = {
        interestRate: 150, // invalid: > 100
        termMonths: -1, // invalid: negative
      };

      mockRepository.findById.mockResolvedValue(existingProduct);

      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(invalidUpdateDto)
        .expect(400);
    });
  });

  describe('/products/:id (DELETE)', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const existingProduct = {
      id: productId,
      name: 'Personal Loan',
      code: ProductCode.PERSONAL_LOAN,
      term: { months: 24 },
      interestRate: { value: 5.5 },
      sum: 10000,
    };

    it('should delete a product', async () => {
      mockRepository.findById.mockResolvedValue(existingProduct);
      mockRepository.delete.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200);

      expect(mockRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should return 404 when deleting non-existent product', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete(`/products/${nonExistentId}`)
        .expect(404);
    });
  });
});
