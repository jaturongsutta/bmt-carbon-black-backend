import { Module } from '@nestjs/common';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordController } from './production-daily-volumn-record.controller';

@Module({
  providers: [ProductionDailyVolumnRecordService],
  controllers: [ProductionDailyVolumnRecordController]
})
export class ProductionDailyVolumnRecordModule {}
