import { Module, Logger } from '@nestjs/common';
import { ApplicationLogService } from './application-log.service';
import { ApplicationLogController } from './application-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predefine } from 'src/entity/predefine.entity';
import { PredefineService } from '../predefine/predefine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Predefine])],
  providers: [ApplicationLogService, Logger, PredefineService],
  controllers: [ApplicationLogController],
})
export class ApplicationLogModule {}
