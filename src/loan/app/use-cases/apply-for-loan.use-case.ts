import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ApplyLoanDto } from '../dto/apply-loan.dto';
import { LoanDecision } from '../entities/loan-decision.entity';
import { LoanRepository } from '../domain/repositories/loan.repository';
import { Loan } from '../domain/entities/loan.entity';

export class ApplyForLoanUseCase {
  constructor(
    @Inject('LoanRepository') private readonly repo: LoanRepository,
  ) {}

  async execute(dto: ApplyLoanDto): Promise<LoanDecision> {
    // ...логика
    await this.repo.save(loan);
  }
}