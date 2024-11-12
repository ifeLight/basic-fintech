import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signUp() {
    return 'Sign up';
  }

  @Post('login')
  logIn() {
    return 'Log in';
  }

  @Get('profile')
  getProfile() {
    this.userService.getHello();
    return 'Profile';
  }
}
