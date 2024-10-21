import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Request,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';

@Controller('production-daily-volumn-record')
export class ProductionDailyVolumnRecordController extends BaseController {
  constructor(private service: ProductionDailyVolumnRecordService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: ProductionDailyVolumnRecordSearchDto) {
    return await this.service.search(dto);
  }

  // @Get('getById/:id')
  // async getById(@Param('id') id: number) {
  //   return await this.service.getById(id);
  // }

  // @Post('add')
  // async add(@Body() dto: TankShippingDto, @Request() req: any) {
  //   return await this.service.add(dto, req.user.userId);
  // }

  // @Put('update/:id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() dto: TankShippingDto,
  //   @Request() req: any,
  // ) {
  //   return await this.service.update(id, dto, req.user.userId);
  // }

  // @Delete('delete/:id')
  // async delete(@Param('id') id: number, @Request() req: any) {
  //   return await this.service.delete(id, req.user.userId);
  // }
}
