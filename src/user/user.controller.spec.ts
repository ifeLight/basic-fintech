import { TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getTestingModule } from '../test.module';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
