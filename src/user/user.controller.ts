import * as express from 'express';
import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../entities/user';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get User Profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User Profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: express.Request): Promise<User> {
    const userId: string = req['user'].sub;
    const user = await this.userService.getUser(userId);
    return user;
  }
}
