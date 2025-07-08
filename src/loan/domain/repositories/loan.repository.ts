export interface LoanRepository {
  save(loan: Loan): Promise<void>;
}