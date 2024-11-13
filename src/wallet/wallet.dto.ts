import { IsNumberString, IsString, Length } from 'class-validator';
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

export class FundUserWalletDto {
  @IsString()
  @Length(10)
  accountNumber: string;

  @IsString()
  @IsNumberString()
  amount: string;
}
