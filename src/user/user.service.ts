import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    console.log(this.configService.get('database.name'));
    return 'Hello World!';
  }
}
