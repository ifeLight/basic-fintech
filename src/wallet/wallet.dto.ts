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
    type: String,
    required: false,
  })
  startDate?: string;

  @ApiProperty({
    description: 'The end date',
    type: String,
    required: false,
  })
  endDate?: string;

  @ApiProperty({
    description: 'The transaction status',
    example: TransactionStatus.SUCCCESS,
    type: String,
    required: false,
    enum: TransactionStatus,
  })
  status?: TransactionStatus;

  @ApiProperty({
    description: 'The transaction type',
    example: TransactionType.DEPOSIT,
    type: String,
    required: false,
    enum: TransactionType,
  })
  type?: TransactionType;

  @ApiProperty({
    description: 'The transaction amount',
    type: String,
    required: false,
  })
  amount?: string;
}
