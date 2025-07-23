import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanModule } from "./loan.module";
import { RuleInterface } from './domain/services/decision-maker/rule-interface';
import { LoanTypeOrmEntity } from './infrastructure/orm/entities/loan.typeorm-entity';

describe('LoanModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([LoanTypeOrmEntity]),
                LoanModule,
            ],
        }).compile();
    });

    afterEach(async () => {
        if (module) {
            await module.close();
        }
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide rules', () => {
        const rules = module.get<RuleInterface[]>('RULES');
        expect(rules).toBeInstanceOf(Array);
        expect(rules.length).toBeGreaterThan(0);
        
        // Assert that every rule implements RuleInterface
        rules.forEach(rule => {
            expect(rule).toBeDefined();
            expect(typeof rule.getCode).toBe('function');
            expect(typeof rule.apply).toBe('function');
            expect(rule.getCode()).toBeDefined();
        });
    });
});
