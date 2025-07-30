import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmClientRepository } from './client.typeorm.repository';
import { ClientTypeOrmEntity } from '../orm/entities/client.typeorm-entity';
import { Client } from '../../domain/entities/client.entity';
import { FullName } from '../../domain/value-objects/full-name.value-object';
import { CreditScore } from '../../domain/value-objects/credit-score.value-object';
import { Income } from '../../domain/value-objects/income.value-object';
import { USState } from '../../domain/enums/enums';

describe('TypeOrmClientRepository', () => {
  let repository: TypeOrmClientRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<ClientTypeOrmEntity>>;

  const mockClient = new Client(
    '123e4567-e89b-12d3-a456-426614174000',
    new FullName('John', 'Doe'),
    new Date('1990-01-01'),
    new CreditScore(750),
    new Income(5000),
    USState.CA,
  );

  const mockEntity: ClientTypeOrmEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    creditScore: 750,
    monthlyIncome: 5000,
    state: USState.CA,
  };

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmClientRepository,
        {
          provide: getRepositoryToken(ClientTypeOrmEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmClientRepository>(TypeOrmClientRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(ClientTypeOrmEntity));
  });

  describe('save', () => {
    it('should save a client', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      await repository.save(mockClient);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith({
        id: mockClient.id,
        firstName: mockClient.fullName.firstName,
        lastName: mockClient.fullName.lastName,
        dateOfBirth: mockClient.dateOfBirth,
        creditScore: mockClient.creditScore.value,
        monthlyIncome: mockClient.monthlyIncome.value,
        state: mockClient.state,
      });
    });
  });

  describe('findById', () => {
    it('should return a client when found', async () => {
      mockTypeOrmRepository.findOneBy.mockResolvedValue(mockEntity);

      const result = await repository.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBeInstanceOf(Client);
      expect(result!.id).toBe(mockClient.id);
      expect(result!.fullName.firstName).toBe('John');
      expect(result!.fullName.lastName).toBe('Doe');
      expect(mockTypeOrmRepository.findOneBy).toHaveBeenCalledWith({ 
        id: '123e4567-e89b-12d3-a456-426614174000' 
      });
    });

    it('should return null when client not found', async () => {
      mockTypeOrmRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([mockEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Client);
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await repository.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
