import * as express from 'express';
import {
  Controller,
  Param,
  Request,
  Get,
  HttpStatus,
  Query,
  UseGuards,
  Body,
  Post,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { UserWallet } from '../entities/user-wallet';
import { UserTransaction } from '../entities/user-transaction';
import { PaginationData } from '../entities/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { FundUserWalletDto, TransactionQuery } from './wallet.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get User Wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Wallet',
    type: UserWallet,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async getWallet(@Request() req: express.Request): Promise<UserWallet> {
    const userId: string = req['user'].sub;
    return await this.walletService.getWallet(userId);
  }

  @ApiOperation({ summary: 'Get Transaction By ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Transaction',
    type: UserTransaction,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('transaction/:id')
  async getTRansactionById(
    @Request() req: express.Request,
    @Param('id') transactionId: string,
  ): Promise<UserTransaction> {
    const userId: string = req['user'].sub;
    return await this.walletService.getTransaction(transactionId, userId);
  }

  @ApiOperation({ summary: 'Get User Transactions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Transactions',
    type: PaginationData<UserTransaction>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('transactions')
  async getTransactions(
    @Request() req: express.Request,
    @Query() query: TransactionQuery,
  ): Promise<PaginationData<UserTransaction>> {
    const userId: string = req['user'].sub;
    return await this.walletService.listTransactions(userId, query);
  }

  @ApiOperation({ summary: 'Fund User Wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Transaction',
    type: UserTransaction,
  })
  @HttpCode(HttpStatus.OK)
  @Post('fund')
  async fundUserWallet(
    @Body() data: FundUserWalletDto,
  ): Promise<UserTransaction> {
    return await this.walletService.fundWalletByAccountNumber(
      data.accountNumber,
      data.amount,
    );
  }

  @ApiOperation({ summary: 'Transfer Funds' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Transaction',
    type: UserTransaction,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  async transferFunds(
    @Request() req: express.Request,
    @Body() data: FundUserWalletDto,
  ): Promise<UserTransaction> {
    const userId: string = req['user'].sub;
    return await this.walletService.transferToAccountNumber(
      userId,
      data.accountNumber,
      data.amount,
    );
  }
}
