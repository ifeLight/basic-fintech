import { TransactionStatus, TransactionType } from 'src/entities/interfaces';

export class CreateUserTransactionDto {
  userId: string;
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  transferToId?: string;
  transferFromId?: string;
  reference?: string;
  description?: string;
}
