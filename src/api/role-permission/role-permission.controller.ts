import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { RolePermissionService } from './role-permission.service';
import { RoleSearchDto } from './dto/role-search.dto';

@Controller('role-permission')
export class RolePermissionController extends BaseController {
  constructor(private service: RolePermissionService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: RoleSearchDto) {
    return this.service.search(dto);
  }
}
