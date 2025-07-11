import { Loan } from '../entities/loan.entity';

export interface LoanRepository {
  save(loan: Loan): Promise<void>;
}