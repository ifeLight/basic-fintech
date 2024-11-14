import { TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { getTestingModule } from '../test.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
