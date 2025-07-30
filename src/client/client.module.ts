import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientTypeOrmEntity } from './infrastructure/orm/entities/client.typeorm-entity';
import { TypeOrmClientRepository } from './infrastructure/persistence/client.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTypeOrmEntity])],
  controllers: [ClientController],
  providers: [
    ClientService,
    {
      provide: 'ClientRepository',
      useClass: TypeOrmClientRepository,
    },
  ],
  exports: ['ClientRepository'],
})
export class ClientModule {}
