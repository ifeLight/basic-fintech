import { TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { getTestingModule } from '../test.module';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();
    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
