import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));
  await app.listen(parseInt(process.env.APP_PORT) || 3000);
}
bootstrap();
