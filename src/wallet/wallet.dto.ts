import { ApiProperty } from '@nestjs/swagger';
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
