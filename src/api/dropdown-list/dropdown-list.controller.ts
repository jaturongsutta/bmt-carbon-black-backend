import { Controller, Get, Param, Request } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { DropdownListService } from './dropdown-list.service';

@Controller('dropdown-list')
export class DropdownListController extends BaseController {
  constructor(private service: DropdownListService) {
    super();
  }

  @Get('predefine-group-all')
  async getPredefineGroupAll() {
    const rows = await this.service.getPredefindAll();
    const data = [];
    for (let i = 0; i < rows.length; i++) {
      const e = rows[i];
      data.push({ value: e['predefine_group'], text: e['display'] });
    }
    return data;
  }

  @Get('predefine-group/:group')
  getPredefine(@Request() req: any, @Param('group') group: string) {
    return this.service.getPredefine(group, req.headers.language);
  }
}
