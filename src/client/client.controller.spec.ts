import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './domain/repositories/client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './domain/entities/client.entity';
import { FullName } from './domain/value-objects/full-name.value-object';
import { CreditScore } from './domain/value-objects/credit-score.value-object';
import { Income } from './domain/value-objects/income.value-object';
import { USState } from './domain/enums/enums';
import { NotFoundException } from '@nestjs/common';

describe('ClientController', () => {
  let controller: ClientController;
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
      controllers: [ClientController],
      providers: [
        ClientService,
        {
          provide: 'ClientRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
    mockRepository = module.get('ClientRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
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
      jest.spyOn(service, 'create').mockResolvedValue(mockClient);

      const result = await controller.create(createClientDto);

      expect(result).toBe(mockClient);
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      const clients = [mockClient];
      
      mockRepository.findAll.mockResolvedValue(clients);
      jest.spyOn(service, 'findAll').mockResolvedValue(clients);

      const result = await controller.findAll();

      expect(result).toBe(clients);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no clients exist', async () => {
      const clients: Client[] = [];
      
      mockRepository.findAll.mockResolvedValue(clients);
      jest.spyOn(service, 'findAll').mockResolvedValue(clients);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockRepository.findById.mockResolvedValue(mockClient);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockClient);

      const result = await controller.findOne(clientId);

      expect(result).toBe(mockClient);
      expect(service.findOne).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException when client not found', async () => {
      const clientId = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`Client with ID ${clientId} not found`));

      await expect(controller.findOne(clientId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(clientId);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
        creditScore: 800,
      };

      const updatedClient = new Client(
        clientId,
        new FullName('Jane', 'Doe'),
        new Date('1990-01-01'),
        new CreditScore(800),
        new Income(5000),
        USState.CA,
      );

      mockRepository.findById.mockResolvedValue(mockClient);
      mockRepository.save.mockResolvedValue(undefined);
      jest.spyOn(service, 'update').mockResolvedValue(updatedClient);

      const result = await controller.update(clientId, updateClientDto);

      expect(result).toBe(updatedClient);
      expect(service.update).toHaveBeenCalledWith(clientId, updateClientDto);
    });

    it('should throw NotFoundException when updating non-existent client', async () => {
      const clientId = 'non-existent-id';
      const updateClientDto: UpdateClientDto = {
        firstName: 'Jane',
      };

      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`Client with ID ${clientId} not found`));

      await expect(controller.update(clientId, updateClientDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(clientId, updateClientDto);
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      const clientId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockRepository.findById.mockResolvedValue(mockClient);
      mockRepository.delete.mockResolvedValue(undefined);
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(clientId);

      expect(service.remove).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException when deleting non-existent client', async () => {
      const clientId = 'non-existent-id';
      
      mockRepository.findById.mockResolvedValue(null);
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`Client with ID ${clientId} not found`));

      await expect(controller.remove(clientId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(clientId);
    });
  });
});
