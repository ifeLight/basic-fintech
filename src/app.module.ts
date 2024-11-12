import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { WalletController } from './wallet/wallet.controller';
import { UserService } from './user/user.service';
import { WalletService } from './wallet/wallet.service';
import { User } from './entities/user';
import { UserWallet } from './entities/user-wallet';
import { UserPassword } from './entities/user-password';
import { UserTransaction } from './entities/user-transaction';
import { LastGeneratedAccountNumber } from './entities/last-generate-account-number';

const ConfigModuleReUse = ConfigModule.forRoot({
  load: [configuration],
});

@Module({
  imports: [
    ConfigModuleReUse,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModuleReUse],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [
          User,
          UserWallet,
          UserPassword,
          UserTransaction,
          LastGeneratedAccountNumber,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, UserController, WalletController],
  providers: [AppService, UserService, WalletService],
})
export class AppModule {}
