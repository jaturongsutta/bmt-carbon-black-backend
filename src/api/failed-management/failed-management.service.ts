import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { FailedManagementSearchDto } from './dto/failed-management-search.dto';

@Injectable()
export class FailedManagementService {
  constructor(private commonService: CommonService) {}
  async search(dto: FailedManagementSearchDto) {
    console.log('dto', dto);

    const req = await this.commonService.getConnection();
    req.input('Month', dto.month);
    req.input('Year', dto.year);
    req.input('Line', dto.line);
    req.input('ProductName', dto.productName);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch(
      'sp_search_failed_management',
      req,
    );
  }
}
