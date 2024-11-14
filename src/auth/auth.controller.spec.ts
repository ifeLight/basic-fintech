import { TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { getTestingModule } from '../test.module';
import { before } from 'node:test';
import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from 'src/user/user.dto';
import { UserLoginDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();
    controller = module.get<AuthController>(AuthController);
  });

  describe('Controller accessibility', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('User Authentication', () => {
    let userEmail: string;
    let userPassword: string;

    before(() => {
      userEmail = faker.internet.email();
      userPassword = faker.internet.password();
    });

    describe('Sign up', () => {
      let signupForm: CreateUserDto;

      before(() => {
        signupForm = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          email: userEmail,
          password: userPassword,
        };
      });

      it('should create a new user', async () => {
        const result = await controller.signup(signupForm);
        expect(result).toHaveProperty('accessToken');
      });
    });

    describe('Login', () => {
      let loginForm: UserLoginDto;

      before(() => {
        loginForm = {
          email: userEmail,
          password: userPassword,
        };
      });

      it('should login a user', async () => {
        const result = await controller.login(loginForm);
        expect(result).toHaveProperty('accessToken');
      });
    });
  });
});
