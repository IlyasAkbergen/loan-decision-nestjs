import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('loans')
export class LoanTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { name: 'client_id' })
    clientId: string;

    @Column('uuid', { name: 'product_id' })
    productId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    sum: number;

    @Column('integer', { name: 'term_months' })
    termMonths: number;

    @Column('decimal', { precision: 5, scale: 2, name: 'interest_rate' })
    interestRate: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
