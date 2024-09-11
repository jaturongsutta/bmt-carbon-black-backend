import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { um_User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([um_User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
