import { Module } from '@nestjs/common';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordController } from './production-daily-volumn-record.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [ProductionDailyVolumnRecordService, CommonService],
  controllers: [ProductionDailyVolumnRecordController],
})
export class ProductionDailyVolumnRecordModule {}
