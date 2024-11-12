import {
  IQueryParams,
  TransactionStatus,
  TransactionType,
} from 'src/entities/interfaces';

export interface ITransactionQuery extends IQueryParams {
  startDate?: string | Date;
  endDate?: string | Date;
  status: TransactionStatus;
  type: TransactionType;
  amount: string;
}
