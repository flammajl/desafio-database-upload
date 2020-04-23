import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findIncome = await this.find({ where: { type: 'income' } });
    const findOutcome = await this.find({ where: { type: 'outcome' } });

    const income = findIncome.reduce((start, next) => {
      return start + next.value;
    }, 0);

    const outcome = findOutcome.reduce((start, next) => {
      return start + next.value;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public async findWithCategory(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('transactions')
      .leftJoin('transactions.category', 'category')
      .select([
        'transactions.id',
        'transactions.title',
        'transactions.value',
        'transactions.type',
      ])
      .addSelect('category.title')
      .addSelect('category.id')
      .getMany();

    return transactions;
  }
}

export default TransactionsRepository;
