import { Entity, PrimaryColumn, Column } from 'typeorm';
import { USState } from '../../../domain/enums/enums';

@Entity('clients')
export class ClientTypeOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column('date')
    dateOfBirth: Date;

    @Column('int')
    creditScore: number;

    @Column('decimal', { precision: 10, scale: 2 })
    monthlyIncome: number;

    @Column({
        type: 'enum',
        enum: USState,
    })
    state: USState;
}
