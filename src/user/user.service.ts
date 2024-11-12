import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from 'src/entities/user';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
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
    await this.dataSource.manager.save({
      userId: user.id,
      password: await bcrypt.hash(userData.password, 10),
    });
    return user;
  }

  async verifyUserEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.getUserByEmail(email, true);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.password) throw new InternalServerErrorException();
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password.password,
    );
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
