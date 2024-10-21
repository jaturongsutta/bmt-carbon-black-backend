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

@Controller('failed-management')
export class FailedManagementController extends BaseController {
  constructor(private service: FailedManagementService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: FailedManagementSearchDto) {
    return await this.service.search(dto);
  }
}
