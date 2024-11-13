import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from './auth.dto';
import { CreateUserDto } from 'src/user/user.dto';
import { ITokenResponse } from './auth.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: UserLoginDto): Promise<ITokenResponse> {
    return await this.authService.login(data.email, data.password);
  }

  @ApiOperation({ summary: 'Signup User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() data: CreateUserDto): Promise<ITokenResponse> {
    return await this.authService.register(data);
  }
}
