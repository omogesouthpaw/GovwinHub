import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT ?? 3000}`;
  const docBuilder = new DocumentBuilder()
    .setTitle('GovWinHub API')
    .setDescription('GovWinHub Backend — AI-Powered Government Contract Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(appUrl);
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, docBuilder.build()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
