import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from '../entities/user';
import { CreateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPassword } from '../entities/user-password';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const emailExist = await this.userEmailExist(userData.email);
    if (emailExist) {
      throw new BadRequestException('Email already exist on platform');
    }
    const user = this.userRepository.create({
      email: userData.email.trim().toLowerCase(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
    });
    await this.userRepository.save(user);
    const password = this.dataSource.manager.create(UserPassword, {
      userId: user.id,
      password: await hash(userData.password, 10),
    });
    await this.dataSource.manager.save(password);
    return user;
  }

  async verifyUserEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.getUserByEmail(email, true);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.password) throw new InternalServerErrorException();
    const isPasswordValid = await compare(password, user.password.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    delete user.password;
    return user;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User do not exist');
    }
    return user;
  }

  private async getUserByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const extraRelations: FindOptionsRelations<User> = {};
    if (includePassword) {
      extraRelations.password = true;
    }
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: extraRelations,
    });
  }

  private async userEmailExist(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email: email.toLowerCase() });
  }
}
