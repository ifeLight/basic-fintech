import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
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
import { KeyValue } from './entities/key-value';

const ConfigModuleReUse = ConfigModule.forRoot({
  load: [configuration],
});

const entities = [User, UserWallet, UserPassword, UserTransaction, KeyValue];

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
        entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    JwtModule.registerAsync({
      imports: [ConfigModuleReUse],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    UserController,
    WalletController,
    AuthController,
  ],
  providers: [AppService, UserService, WalletService, AuthService],
})
export class AppModule {}
