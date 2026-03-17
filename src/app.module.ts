import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import environmentValidation from './config/environment.validation';
import { KnexModule } from './database';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: environmentValidation,
    }),
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('config.dbHost', 'localhost'),
        port: configService.get('config.dbPort', 3306),
        user: configService.get('config.dbUser', 'root'),
        password: configService.get('config.dbPassword', ''),
        database: configService.get('config.dbName', 'govwinhub'),
      }),
    }),
    LoggerModule,
    AuthModule,
    UserModule,
    CompanyModule,
    OpportunitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
