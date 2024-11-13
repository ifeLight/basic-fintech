import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import { KeyValue } from 'src/entities/key-value';
import { UserWallet } from 'src/entities/user-wallet';
import {
  Between,
  DataSource,
  EntityManager,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { CreateUserTransactionDto } from './wallet.dto';
import { UserTransaction } from 'src/entities/user-transaction';
import {
  IPaginationData,
  TransactionStatus,
  TransactionType,
} from 'src/entities/interfaces';
import { ITransactionQuery } from './wallet.interface';
import { getDocuments } from 'src/utils/database';

@Injectable()
export class WalletService {
  private readonly LAST_ACCOUNT_NUMBER_KEY = 'last-account-number';
  private readonly FIRST_ACCOUNT_NUMBER = '1000000000';

  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async getWallet(userId: string): Promise<UserWallet> {
    const userWallet = await this.dataSource.manager.findOne(UserWallet, {
      where: { userId },
    });
    if (userWallet) return userWallet;
    return await this.createWallet(userId);
  }

  async getTransaction(
    transactionId: string,
    userId?: string,
    txnManager?: EntityManager,
  ): Promise<UserTransaction> {
    const manager = txnManager || this.dataSource.manager;
    const relations: FindOptionsRelations<UserTransaction> = !txnManager
      ? { transferFrom: true, transferTo: true }
      : {};
    const extraOptions: FindOneOptions<UserTransaction> = txnManager
      ? { lock: { mode: 'pessimistic_write' } }
      : {};
    const extraWhere: FindOptionsWhere<UserTransaction> = {};
    if (userId) extraWhere['userId'] = userId;
    const userTransaction = await manager.findOne(UserTransaction, {
      where: { id: transactionId, ...extraWhere },
      ...relations,
      ...extraOptions,
    });
    if (!userTransaction) {
      throw new NotFoundException('Transaction not found');
    }
    return userTransaction;
  }

  async listTransactions(
    userId: string,
    query: ITransactionQuery,
  ): Promise<IPaginationData<UserTransaction>> {
    const { type, status, startDate, endDate } = query;
    const extraWhere: FindOptionsWhere<UserTransaction> = {};
    if (type) extraWhere['type'] = type;
    if (status) extraWhere['status'] = status;
    if (startDate || endDate) {
      const startDateValue = startDate ? new Date(startDate) : new Date(0);
      const endDateValue = endDate ? new Date(endDate) : new Date();
      extraWhere['createdAt'] = Between(startDateValue, endDateValue);
    }
    const result = await getDocuments(
      this.dataSource.manager,
      UserTransaction,
      {
        query,
        options: {
          where: { userId, ...extraWhere },
        },
        limits: {
          limit: 20,
          searchFields: ['description'],
          searchIdFields: ['id'],
        },
      },
    );
    return result;
  }

  async fundWalletByAccountNumber(
    accountNumber: string,
    amount: string,
  ): Promise<UserTransaction> {
    amount = new Decimal(amount).toFixed(2);
    if (new Decimal(amount).lte(0)) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const userWallet = await this.getFlatWalletByAccountNumber(accountNumber);
    if (!userWallet) {
      throw new NotFoundException('Account number is invalid');
    }
    const tx = await this.dataSource.manager.transaction(
      'SERIALIZABLE',
      async (manager: EntityManager) => {
        const allSettled = await Promise.allSettled([
          this.createTransactionHistory(
            {
              userId: userWallet.userId,
              amount,
              type: TransactionType.DEPOSIT,
              status: TransactionStatus.SUCCCESS,
              description: 'Deposit',
            },
            manager,
          ),
          manager.update(
            UserWallet,
            { id: userWallet.id },
            { amount: () => `amount + ${amount}` },
          ),
        ]);
        if (allSettled.some((result) => result.status === 'rejected')) {
          throw new BadRequestException('Failed to fund wallet');
        }
        const [deposit] = allSettled
          .slice(0, 1)
          .map((result) =>
            result.status === 'fulfilled' ? result.value : null,
          );
        return deposit as UserTransaction;
      },
    );
    return tx;
  }

  async transferToAccountNumber(
    userId: string,
    accountNumber: string,
    amount: string,
  ): Promise<UserTransaction> {
    amount = new Decimal(amount).toFixed(2);
    if (new Decimal(amount).lte(0)) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const tx = await this.dataSource.manager.transaction(
      'SERIALIZABLE',
      async (manager: EntityManager) => {
        const usersWalletsResult = await Promise.allSettled([
          manager.findOne(UserWallet, {
            where: { userId },
            lock: { mode: 'pessimistic_write' },
          }),
          this.getFlatWalletByAccountNumber(accountNumber, manager),
        ]);
        if (usersWalletsResult[0].status === 'rejected') {
          throw new NotFoundException('User wallet not found');
        }
        if (usersWalletsResult[1].status === 'rejected') {
          throw new NotFoundException('Recipient wallet not found');
        }
        const [fromWallet, toWallet] = usersWalletsResult.map((result) =>
          result.status === 'fulfilled' ? result.value : null,
        );
        if (!fromWallet) {
          throw new BadRequestException('You do not have enough balance');
        }
        if (!toWallet) {
          throw new BadRequestException('Recipient account number is invalid');
        }
        if (new Decimal(fromWallet.amount).lt(amount)) {
          throw new BadRequestException('Insufficient balance');
        }
        fromWallet.amount = new Decimal(fromWallet.amount)
          .minus(amount)
          .toString();
        toWallet.amount = new Decimal(toWallet.amount).plus(amount).toString();
        const toUpdate = [
          this.createTransactionHistory(
            {
              userId,
              amount: new Decimal(amount).negated().toString(),
              type: TransactionType.TRANSFER_OUT,
              status: TransactionStatus.SUCCCESS,
              transferToId: toWallet.id,
              description: `Transfer to ${toWallet.accountNumber}`,
            },
            manager,
          ),
          this.createTransactionHistory(
            {
              userId: toWallet.userId,
              amount,
              type: TransactionType.TRANSFER_IN,
              status: TransactionStatus.SUCCCESS,
              transferFromId: fromWallet.id,
              description: `Transfer from ${fromWallet.accountNumber}`,
            },
            manager,
          ),
          manager.save(fromWallet),
          manager.save(toWallet),
        ];
        const allSettled = await Promise.allSettled(toUpdate);
        if (allSettled.some((result) => result.status === 'rejected')) {
          throw new BadRequestException('Failed to transfer');
        }
        const [transferOut] = allSettled
          .slice(0, 1)
          .map((result) =>
            result.status === 'fulfilled' ? result.value : null,
          );
        return transferOut as UserTransaction;
      },
    );
    return tx;
  }

  async getFlatWalletByAccountNumber(
    accountNumber: string,
    txnManager?: EntityManager,
  ): Promise<UserWallet | null> {
    const manager = txnManager || this.dataSource.manager;
    const extraOptions: FindOneOptions<UserWallet> = txnManager
      ? { lock: { mode: 'pessimistic_write' } }
      : {};
    const userWallet = await manager.findOne(UserWallet, {
      where: { accountNumber },
      ...extraOptions,
    });
    return userWallet;
  }

  private async createTransactionHistory(
    data: CreateUserTransactionDto,
    txnManager?: EntityManager,
  ): Promise<UserTransaction> {
    const manager = txnManager || this.dataSource.manager;
    const userTransaction = manager.create(UserTransaction, {
      ...data,
    });
    await this.dataSource.manager.save(userTransaction);
    return userTransaction;
  }

  private async createWallet(
    userId: string,
    txnManager?: EntityManager,
  ): Promise<UserWallet> {
    const LAST_ACCOUNT_NUMBER_KEY = this.LAST_ACCOUNT_NUMBER_KEY;
    const FIRST_ACCOUNT_NUMBER = this.FIRST_ACCOUNT_NUMBER;
    const createWalletTxn = async (manager: EntityManager) => {
      const wallet = await manager.findOne(UserWallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (wallet) return wallet;
      let lastAccountNumber = await manager.findOne(KeyValue, {
        where: { key: LAST_ACCOUNT_NUMBER_KEY },
        lock: { mode: 'pessimistic_write' },
      });
      if (!lastAccountNumber) {
        lastAccountNumber = manager.create(KeyValue, {
          key: LAST_ACCOUNT_NUMBER_KEY,
          value: FIRST_ACCOUNT_NUMBER,
        });
        await manager.save(lastAccountNumber);
      }
      const accountNumber = new Decimal(lastAccountNumber.value)
        .plus(1)
        .toString();
      lastAccountNumber.value = accountNumber;
      const userWallet = manager.create(UserWallet, {
        userId,
        accountNumber,
      });
      const allSettled = await Promise.allSettled([
        manager.save(lastAccountNumber),
        manager.save(userWallet),
      ]);
      if (allSettled.some((result) => result.status === 'rejected')) {
        throw new InternalServerErrorException('Failed to create wallet');
      }
      return userWallet;
    };
    if (txnManager) {
      return createWalletTxn(txnManager);
    }
    const userWallet = this.dataSource.manager.transaction(
      'SERIALIZABLE',
      createWalletTxn,
    );
    return userWallet;
  }
}
