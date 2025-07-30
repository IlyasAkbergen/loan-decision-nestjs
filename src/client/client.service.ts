import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './domain/repositories/client.repository';
import { Client } from './domain/entities/client.entity';
import { FullName } from './domain/value-objects/full-name.value-object';
import { CreditScore } from './domain/value-objects/credit-score.value-object';
import { Income } from './domain/value-objects/income.value-object';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientService {
  constructor(
    @Inject('ClientRepository')
    private readonly clientRepository: ClientRepository,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = new Client(
      uuidv4(),
      new FullName(createClientDto.firstName, createClientDto.lastName),
      new Date(createClientDto.dateOfBirth),
      new CreditScore(createClientDto.creditScore),
      new Income(createClientDto.monthlyIncome),
      createClientDto.state,
    );

    await this.clientRepository.save(client);
    return client;
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const existingClient = await this.findOne(id);
    
    const updatedClient = new Client(
      existingClient.id,
      updateClientDto.firstName || updateClientDto.lastName
        ? new FullName(
            updateClientDto.firstName ?? existingClient.fullName.firstName,
            updateClientDto.lastName ?? existingClient.fullName.lastName,
          )
        : existingClient.fullName,
      updateClientDto.dateOfBirth ? new Date(updateClientDto.dateOfBirth) : existingClient.dateOfBirth,
      updateClientDto.creditScore ? new CreditScore(updateClientDto.creditScore) : existingClient.creditScore,
      updateClientDto.monthlyIncome ? new Income(updateClientDto.monthlyIncome) : existingClient.monthlyIncome,
      updateClientDto.state ?? existingClient.state,
    );

    await this.clientRepository.save(updatedClient);
    return updatedClient;
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.delete(client.id);
  }
}
