import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Theemail of the user',
    example: 'abc@mail.com',
    type: String,
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    type: String,
  })
  password: string;
}

export class TokenResponseDto {
  @ApiProperty({
    description: 'The access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: String,
  })
  accessToken: string;
}
