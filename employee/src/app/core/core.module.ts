import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonLogger } from '../shared/logger/winston.logger';
import { ConfigModule, ConfigService } from '@devon4node/config';
import { Config } from '../shared/model/config/config.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Config>) => {
        return config.values.database;
      },
      inject: [ConfigService],
    }),
    ConfigModule.register({
      configType: Config,
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }, WinstonLogger],
  exports: [UserModule, AuthModule, ConfigModule, WinstonLogger],
})
export class CoreModule {}
