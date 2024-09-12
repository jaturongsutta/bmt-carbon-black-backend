import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { CommonModule } from './common/common.module';
import * as dotenv from 'dotenv';
import { MenuRouteModule } from './api/menu-route/menu-route.module';

dotenv.config(); // Load environment variables from .env file
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        extra: {
          trustServerCertificate: true,
        },
      }),
    }),
    UserModule,
    AuthModule,
    CommonModule,
    MenuRouteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
