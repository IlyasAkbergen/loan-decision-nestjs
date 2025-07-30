import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { ClientRepository } from './domain/repositories/client.repository';
import { Client } from './domain/entities/client.entity';
import { FullName } from './domain/value-objects/full-name.value-object';
import { CreditScore } from './domain/value-objects/credit-score.value-object';
import { Income } from './domain/value-objects/income.value-object';
import { USState } from './domain/enums/enums';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { NotFoundException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;
  let mockRepository: jest.Mocked<ClientRepository>;

  const mockClient = new Client(
    '123e4567-e89b-12d3-a456-426614174000',
    new FullName('John', 'Doe'),
    new Date('1990-01-01'),
    new CreditScore(750),
    new Income(5000),
    USState.CA,
  );

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: 'ClientRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    mockRepository = module.get('ClientRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto: CreateClientDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        creditScore: 750,
        monthlyIncome: 5000,
        state: USState.CA,
      };

      mockRepository.save.mockResolvedValue();

      const result = await service.create(createClientDto);

      expect(result).toBeInstanceOf(Client);
      expect(result.fullName.firstName).toBe('John');
      expect(result.fullName.lastName).toBe('Doe');
      expect(result.state).toBe(USState.CA);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Client));
    });
  });

  describe('findOne', () => {
    it('should return a client when found', async () => {
      mockRepository.findById.mockResolvedValue(mockClient);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBe(mockClient);
      expect(mockRepository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException when client not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      const clients = [mockClient];
      mockRepository.findAll.mockResolvedValue(clients);

      const result = await service.findAll();

      expect(result).toBe(clients);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
        creditScore: 800,
      };

      mockRepository.findById.mockResolvedValue(mockClient);
      mockRepository.save.mockResolvedValue();

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateClientDto);

      expect(result).toBeInstanceOf(Client);
      expect(result.fullName.firstName).toBe('Jane');
      expect(result.fullName.lastName).toBe('Doe'); // unchanged
      expect(result.creditScore.value).toBe(800);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Client));
    });

    it('should throw NotFoundException when updating non-existent client', async () => {
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
      };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateClientDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      mockRepository.findById.mockResolvedValue(mockClient);
      mockRepository.delete.mockResolvedValue();

      await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(mockRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException when deleting non-existent client', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
