import { Module } from '@nestjs/common';
import { CoSystemParametersService } from './co-system-parameters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoSystemParameters } from 'src/entity/co-system-parameters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoSystemParameters])],
  providers: [CoSystemParametersService],
  exports: [CoSystemParametersService],
})
export class CoSystemParametersModule {}
