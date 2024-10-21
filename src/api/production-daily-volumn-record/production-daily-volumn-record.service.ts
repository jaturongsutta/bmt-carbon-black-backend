import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';

@Injectable()
export class ProductionDailyVolumnRecordService {
  constructor(private commonService: CommonService) {}

  async search(dto: ProductionDailyVolumnRecordSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Date', dto.date);
    req.input('Line', dto.line);
    req.input('Grade', dto.grade);
    req.input('ProductName', dto.productName);

    return await this.commonService.getSearch('sp_search_prod_daily', req);
  }
}
