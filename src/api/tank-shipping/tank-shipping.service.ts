import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { TankShippingDto } from './dto/tank-shipping.dto';

@Injectable()
export class TankShippingService {
  constructor(private commonService: CommonService) {}

  async search(dto: TankShippingDto) {
    const req = await this.commonService.getConnection();
    req.input('Date', dto.date);
    req.input('Tank', dto.tank);
    req.input('ProductName', dto.product);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_search_tank_shipping', req);
  }
}
