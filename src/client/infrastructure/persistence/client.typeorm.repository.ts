import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { ClientTypeOrmEntity } from '../orm/entities/client.typeorm-entity';
import { FullName } from '../../domain/value-objects/full-name.value-object';
import { CreditScore } from '../../domain/value-objects/credit-score.value-object';
import { Income } from '../../domain/value-objects/income.value-object';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
    constructor(
        @InjectRepository(ClientTypeOrmEntity)
        private readonly repository: Repository<ClientTypeOrmEntity>,
    ) {}

    async save(client: Client): Promise<void> {
        const entity: ClientTypeOrmEntity = {
            id: client.id,
            firstName: client.fullName.firstName,
            lastName: client.fullName.lastName,
            dateOfBirth: client.dateOfBirth,
            creditScore: client.creditScore.value,
            monthlyIncome: client.monthlyIncome.value,
            state: client.state,
        };

        await this.repository.save(entity);
    }

    async findById(id: string): Promise<Client | null> {
        const entity = await this.repository.findOneBy({ id });
        
        if (!entity) {
            return null;
        }

        return this.mapToDomain(entity);
    }

    async findAll(): Promise<Client[]> {
        const entities = await this.repository.find();
        return entities.map(entity => this.mapToDomain(entity));
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    private mapToDomain(entity: ClientTypeOrmEntity): Client {
        return new Client(
            entity.id,
            new FullName(entity.firstName, entity.lastName),
            entity.dateOfBirth,
            new CreditScore(entity.creditScore),
            new Income(entity.monthlyIncome),
            entity.state,
        );
    }
}
