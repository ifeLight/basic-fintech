import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { WalletController } from './wallet/wallet.controller';
import { UserService } from './user/user.service';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController, UserController, WalletController],
  providers: [AppService, UserService, WalletService],
})
export class AppModule {}
