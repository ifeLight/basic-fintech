import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';
import {
  QueryParams,
  TransactionStatus,
  TransactionType,
} from '../entities/interfaces';

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
  @ApiProperty({
    description: 'Account Number',
    example: '0123456789',
    type: String,
    maxLength: 10,
    minLength: 10,
  })
  accountNumber: string;

  @IsString()
  @IsNumberString()
  @ApiProperty({
    description: 'Amount',
    example: '1000',
    type: String,
  })
  amount: string;
}

export class TransactionQuery extends QueryParams {
  @ApiProperty({
    description: 'The start date',
    example: '2021-01-01',
    type: String,
    required: false,
  })
  startDate?: string;

  @ApiProperty({
    description: 'The end date',
    example: '2021-01-01',
    type: String,
    required: false,
  })
  endDate?: string;

  @ApiProperty({
    description: 'The transaction status',
    example: 'pending',
    type: String,
    required: false,
  })
  status?: TransactionStatus;

  @ApiProperty({
    description: 'The transaction type',
    example: 'credit',
    type: String,
    required: false,
  })
  type?: TransactionType;

  @ApiProperty({
    description: 'The transaction amount',
    example: '1000',
    type: String,
    required: false,
  })
  amount?: string;
}
