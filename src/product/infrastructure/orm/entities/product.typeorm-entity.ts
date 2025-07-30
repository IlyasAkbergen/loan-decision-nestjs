import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('products')
export class ProductTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 50 })
    @Index('IDX_PRODUCTS_CODE')
    code: string;

    @Column('integer', { name: 'term_months' })
    termMonths: number;

    @Column('decimal', { precision: 5, scale: 2, name: 'interest_rate' })
    interestRate: number;

    @Column('decimal', { precision: 15, scale: 2 })
    sum: number;
}
