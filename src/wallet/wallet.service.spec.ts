import { TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../test.module';
import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker/.';
import { WalletService } from './wallet.service';
import { User } from '../entities/user';
import { UserWallet } from '../entities/user-wallet';
import Decimal from 'decimal.js';
import {
  TransactionFlow,
  TransactionStatus,
  TransactionType,
} from '../entities/interfaces';

describe('UserService', () => {
  let userService: UserService;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();
    userService = module.get<UserService>(UserService);
    walletService = module.get<WalletService>(WalletService);
  });

  describe('Service accessibility', () => {
    it('should be defined', () => {
      expect(walletService).toBeDefined();
    });
  });

  describe('Wallet Service', () => {
    let user1: User;
    let user2: User;
    let user1Wallet: UserWallet;
    let user2Wallet: UserWallet;

    beforeAll(async () => {
      user1 = await userService.createUser({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      user2 = await userService.createUser({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    describe('Create Wallet', () => {
      it('should create a wallet for user1', async () => {
        const result = await walletService.getWallet(user1.id);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('userId', user1.id);
        expect(result).toHaveProperty('amount');
        expect(result).toHaveProperty('accountNumber');
        user1Wallet = result;
      });

      it('get wallet agin, should be same wallet', async () => {
        const result = await walletService.getWallet(user1.id);
        expect(result).toHaveProperty('id', user1Wallet.id);
        expect(result).toHaveProperty('userId', user1Wallet.userId);
        expect(result).toHaveProperty('amount', user1Wallet.amount);
        expect(result).toHaveProperty(
          'accountNumber',
          user1Wallet.accountNumber,
        );
      });

      it('should create a wallet for user2', async () => {
        const result = await walletService.getWallet(user2.id);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('userId', user2.id);
        user2Wallet = result;
        expect(result.accountNumber).not.toBe(user1Wallet.accountNumber);
        expect(
          new Decimal(result.accountNumber)
            .minus(user1Wallet.accountNumber)
            .abs()
            .toNumber(),
        ).toBeGreaterThanOrEqual(1);
      });
    });

    describe('Fund a Wallet', () => {
      const user1Amount = '1000';
      const user2Amount = '2000';

      it('should fund user1 wallet', async () => {
        const result = await walletService.fundWalletByAccountNumber(
          user1Wallet.accountNumber,
          user1Amount,
        );
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('userId', user1.id);
        expect(result).toHaveProperty('amount');
        expect(new Decimal(result.amount).eq(user1Amount)).toBeTruthy();
        expect(result).toHaveProperty('status', TransactionStatus.SUCCCESS);
        expect(result).toHaveProperty('type', TransactionType.DEPOSIT);
        expect(result.flow).toEqual(TransactionFlow.CREDIT);
      });

      it('should fund user2 wallet', async () => {
        const result = await walletService.fundWalletByAccountNumber(
          user2Wallet.accountNumber,
          user2Amount,
        );
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('userId', user2.id);
        expect(result).toHaveProperty('amount');
        expect(new Decimal(result.amount).eq(user2Amount)).toBeTruthy();
        expect(result).toHaveProperty('status', TransactionStatus.SUCCCESS);
        expect(result).toHaveProperty('type', TransactionType.DEPOSIT);
        expect(result.flow).toEqual(TransactionFlow.CREDIT);
      });
    });

    describe('Transfer Fund', () => {
      const transferAmount = '500';
      let previousUser1Wallet: UserWallet;
      let previousUser2Wallet: UserWallet;

      beforeAll(async () => {
        previousUser1Wallet = await walletService.getWallet(user1.id);
        previousUser2Wallet = await walletService.getWallet(user2.id);
      });

      it('should transfer fund from user1 to user2', async () => {
        const amount = '500';
        const result = await walletService.transferToAccountNumber(
          user1.id,
          user2Wallet.accountNumber,
          amount,
        );
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('userId', user1.id);
        expect(result).toHaveProperty('amount');
        console.log('amount', amount);
        console.log('result', result);
        expect(new Decimal(result.amount).negated().eq(amount)).toBeTruthy();
        expect(result).toHaveProperty('status', TransactionStatus.SUCCCESS);
        expect(result).toHaveProperty('type', TransactionType.TRANSFER_OUT);
        expect(result.flow).toEqual(TransactionFlow.DEBIT);
      });

      it('should have the correct amount in user1 and user2 wallet', async () => {
        const user1WalletResult = await walletService.getWallet(user1.id);
        const user2WalletResult = await walletService.getWallet(user2.id);
        expect(user1WalletResult).toHaveProperty('amount');
        expect(
          new Decimal(user1WalletResult.amount).eq(
            new Decimal(previousUser1Wallet.amount).minus(transferAmount),
          ),
        ).toBeTruthy();
        expect(user2WalletResult).toHaveProperty('amount');
        expect(
          new Decimal(user2WalletResult.amount).eq(
            new Decimal(previousUser2Wallet.amount).plus(transferAmount),
          ),
        ).toBeTruthy();
      });
    });

    describe('List Transactions', () => {
      it('should list all transactions', async () => {
        const result = await walletService.listTransactions(user1.id);
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.pagination.total).toBeGreaterThan(0);
        result.data.forEach((transaction) => {
          expect(transaction).toHaveProperty('id');
          expect(transaction).toHaveProperty('userId', user1.id);
          expect(transaction).toHaveProperty('amount');
          expect(transaction).toHaveProperty('status');
          expect(transaction).toHaveProperty('type');
          expect(transaction).toHaveProperty('flow');
        });
      });

      it('should list all transactions with pagination', async () => {
        const result = await walletService.listTransactions(user1.id, {
          page: 1,
          limit: 1,
        });
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBe(1);
        expect(result.pagination.total).toBeGreaterThan(0);
        result.data.forEach((transaction) => {
          expect(transaction).toHaveProperty('id');
          expect(transaction).toHaveProperty('userId', user1.id);
          expect(transaction).toHaveProperty('amount');
          expect(transaction).toHaveProperty('status');
          expect(transaction).toHaveProperty('type');
          expect(transaction).toHaveProperty('flow');
        });
      });

      it('should list all transactions with pagination', async () => {
        const result = await walletService.listTransactions(user1.id, {
          page: 2,
          limit: 1,
        });
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBe(1);
        expect(result.pagination.total).toBeGreaterThan(0);
      });

      it('should list all transactions by type', async () => {
        const result = await walletService.listTransactions(user1.id, {
          type: TransactionType.DEPOSIT,
        });
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.pagination.total).toBeGreaterThan(0);
        result.data.forEach((transaction) => {
          expect(transaction).toHaveProperty('id');
          expect(transaction).toHaveProperty('userId', user1.id);
          expect(transaction).toHaveProperty('type', TransactionType.DEPOSIT);
        });
      });
    });
  });
});
