import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ClientController } from '../src/client/client.controller';
import { ClientService } from '../src/client/client.service';
import { USState } from '../src/client/domain/enums/enums';
import { CreateClientDto } from '../src/client/dto/create-client.dto';
import { UpdateClientDto } from '../src/client/dto/update-client.dto';

describe('ClientController (e2e)', () => {
  let app: INestApplication;

  const mockRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        ClientService,
        {
          provide: 'ClientRepository',
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

  describe('/clients (POST)', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        creditScore: 750,
        monthlyIncome: 5000,
        state: USState.CA,
      };

      mockRepository.save.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/clients')
        .send(createClientDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName.firstName).toBe('John');
      expect(response.body.fullName.lastName).toBe('Doe');
      expect(response.body.state).toBe(USState.CA);
      expect(response.body.creditScore.value).toBe(750);
      expect(response.body.monthlyIncome.value).toBe(5000);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid client data', async () => {
      const invalidClientDto = {
        firstName: '', // invalid: empty string
        lastName: '', // invalid: empty string
        dateOfBirth: 'invalid-date', // invalid: not a valid date
        creditScore: 1000, // invalid: > 850
        monthlyIncome: -1000, // invalid: negative
        state: 'INVALID_STATE', // invalid: not in enum
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(invalidClientDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteClientDto = {
        firstName: 'John',
        // missing required fields
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(incompleteClientDto)
        .expect(400);
    });
  });

  describe('/clients (GET)', () => {
    it('should return all clients', async () => {
      const mockClients = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fullName: { firstName: 'John', lastName: 'Doe' },
          dateOfBirth: '1990-01-01T00:00:00.000Z',
          creditScore: { value: 750 },
          monthlyIncome: { value: 5000 },
          state: USState.CA,
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          fullName: { firstName: 'Jane', lastName: 'Smith' },
          dateOfBirth: '1985-05-15T00:00:00.000Z',
          creditScore: { value: 800 },
          monthlyIncome: { value: 6000 },
          state: USState.NY,
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockClients);

      const response = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no clients exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('/clients/:id (GET)', () => {
    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const mockClient = {
      id: clientId,
      fullName: { firstName: 'John', lastName: 'Doe' },
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      creditScore: { value: 750 },
      monthlyIncome: { value: 5000 },
      state: USState.CA,
    };

    it('should return a client by id', async () => {
      mockRepository.findById.mockResolvedValue(mockClient);

      const response = await request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .expect(200);

      expect(response.body.id).toBe(clientId);
      expect(response.body.fullName.firstName).toBe('John');
      expect(mockRepository.findById).toHaveBeenCalledWith(clientId);
    });

    it('should return 404 when client not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get(`/clients/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/clients/:id (PATCH)', () => {
    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const existingClient = {
      id: clientId,
      fullName: { firstName: 'John', lastName: 'Doe' },
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      creditScore: { value: 750 },
      monthlyIncome: { value: 5000 },
      state: USState.CA,
    };

    it('should update a client', async () => {
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
        creditScore: 800,
      };

      mockRepository.findById.mockResolvedValue(existingClient);
      mockRepository.save.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .send(updateClientDto)
        .expect(200);

      expect(response.body.fullName.firstName).toBe('Jane');
      expect(response.body.fullName.lastName).toBe('Doe'); // unchanged
      expect(response.body.creditScore.value).toBe(800);
      expect(mockRepository.findById).toHaveBeenCalledWith(clientId);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return 404 when updating non-existent client', async () => {
      const nonExistentId = 'non-existent-id';
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
      };

      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch(`/clients/${nonExistentId}`)
        .send(updateClientDto)
        .expect(404);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidUpdateDto = {
        creditScore: 1000, // invalid: > 850
        monthlyIncome: -1000, // invalid: negative
      };

      mockRepository.findById.mockResolvedValue(existingClient);

      await request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .send(invalidUpdateDto)
        .expect(400);
    });
  });

  describe('/clients/:id (DELETE)', () => {
    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const existingClient = {
      id: clientId,
      fullName: { firstName: 'John', lastName: 'Doe' },
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      creditScore: { value: 750 },
      monthlyIncome: { value: 5000 },
      state: USState.CA,
    };

    it('should delete a client', async () => {
      mockRepository.findById.mockResolvedValue(existingClient);
      mockRepository.delete.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .expect(200);

      expect(mockRepository.findById).toHaveBeenCalledWith(clientId);
      expect(mockRepository.delete).toHaveBeenCalledWith(clientId);
    });

    it('should return 404 when deleting non-existent client', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete(`/clients/${nonExistentId}`)
        .expect(404);
    });
  });
});
