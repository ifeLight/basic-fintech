import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { ITokenResponse } from './auth.interface';
import { User } from 'src/entities/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<ITokenResponse> {
    const user = await this.userService.verifyUserEmailAndPassword(
      email,
      password,
    );
    return {
      access_token: this.generateUserToken(user),
    };
  }

  async register(userData: CreateUserDto): Promise<ITokenResponse> {
    const user = await this.userService.createUser(userData);
    return {
      access_token: this.generateUserToken(user),
    };
  }

  private generateUserToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
