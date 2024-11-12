import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  middleName?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 3,
    minLowercase: 0,
    minSymbols: 0,
    minUppercase: 0,
    minNumbers: 0,
  })
  password: string;
}
