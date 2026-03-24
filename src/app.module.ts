import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import environmentValidation from './config/environment.validation';
import { KnexModule } from './database';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module'; 
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: environmentValidation,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('config.dbHost', 'localhost'),
        port: configService.get('config.dbPort', 5432),
        user: configService.get('config.dbUser', 'govcon'),
        password: configService.get('config.dbPassword', ''),
        database: configService.get('config.dbName', 'govcon'),
        ssl: configService.get('config.dbSsl') ? { rejectUnauthorized: false } : false,
      }),
    }),
    LoggerModule,
    AuthModule,
    UserModule,
    CompanyModule,
    OpportunitiesModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
