import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'First Name',
    example: 'John',
    type: String,
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'Last Name',
    example: 'Doe',
    type: String,
  })
  lastName: string;

  @IsString()
  @ApiProperty({
    description: 'Middle Name',
    example: 'Smith',
    type: String,
    required: false,
  })
  middleName?: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'abc@mail.com',
    type: String,
  })
  email: string;

  @IsStrongPassword({
    minLength: 3,
    minLowercase: 0,
    minSymbols: 0,
    minUppercase: 0,
    minNumbers: 0,
  })
  @ApiProperty({
    description: 'Password',
    example: '123456',
    type: String,
  })
  password: string;
}
