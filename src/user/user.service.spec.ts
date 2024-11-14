import { TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../test.module';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker/.';
import { before } from 'node:test';
import { CreateUserDto } from './user.dto';
import { generateRandomUUID } from '../utils/uuid';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule();

    service = module.get<UserService>(UserService);
  });

  describe('Service accessibility', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('User Service', () => {
    let userEmail: string;
    let userPassword: string;
    let userId: string;

    before(() => {
      userEmail = faker.internet.email();
      userPassword = faker.internet.password();
    });

    describe('Create User', () => {
      let userForm: CreateUserDto;

      before(() => {
        userForm = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          middleName: faker.person.middleName(),
          email: userEmail,
          password: userPassword,
        };
      });

      it('should create a new user', async () => {
        const result = await service.createUser(userForm);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email', userEmail.toLowerCase().trim());
        expect(result).toHaveProperty('firstName', userForm.firstName);
        expect(result).toHaveProperty('lastName', userForm.lastName);
        expect(result).toHaveProperty('middleName', userForm.middleName);
        userId = result.id;
      });

      it('should throw an error if email already exist', async () => {
        try {
          await service.createUser(userForm);
        } catch (error) {
          expect(error.message).toBe('Email already exist on platform');
        }
      });
    });

    describe('Verify User Email and Password', () => {
      let loginForm: { email: string; password: string };

      before(() => {
        loginForm = {
          email: userEmail,
          password: userPassword,
        };
      });

      it('should verify user email and password', async () => {
        const result = await service.verifyUserEmailAndPassword(
          loginForm.email,
          loginForm.password,
        );
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('email', userEmail.toLowerCase().trim());
      });

      it('should throw an error if email or password is invalid', async () => {
        try {
          await service.verifyUserEmailAndPassword(
            faker.internet.email(),
            faker.internet.password(),
          );
        } catch (error) {
          expect(error.message).toBe('Invalid email or password');
        }
      });
    });

    describe('Get User', () => {
      it('should get a user', async () => {
        const result = await service.getUser(userId);
        expect(result).toHaveProperty('id', userId);
        expect(result).toHaveProperty('email', userEmail.toLowerCase().trim());
      });

      it('should throw an error if user do not exist', async () => {
        try {
          await service.getUser(generateRandomUUID());
        } catch (error) {
          expect(error.message).toBe('User do not exist');
        }
      });
    });
  });
});
