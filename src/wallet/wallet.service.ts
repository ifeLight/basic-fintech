import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    console.log(this.configService.get('DATABASE_NAME'));
    return 'Hello World!';
  }
}
