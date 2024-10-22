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
import { FailedManagementSearchDto } from './dto/failed-management-search.dto';
import { FailedManagementService } from './failed-management.service';
import { FailedManagementDto } from './dto/failed-management.dto';

@Controller('failed-management')
export class FailedManagementController extends BaseController {
  constructor(private service: FailedManagementService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: FailedManagementSearchDto) {
    return await this.service.search(dto);
  }

  @Get('get-product-weight/:line/:productName')
  async getProductWeight(
    @Param('line') line: number,
    @Param('productName') productName: string,
  ) {
    return await this.service.getProductWeight(line, productName);
  }

  @Get('get-by-id/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: FailedManagementDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: FailedManagementDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: any) {
    return await this.service.delete(id, req.user.userId);
  }
}
