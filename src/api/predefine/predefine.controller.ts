import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Query,
  Res,
  Request,
} from '@nestjs/common';
import { PredefineService } from './predefine.service';

import { Response } from 'express';
import { BaseController } from 'src/base.controller';
import { PredefineDto } from './dto/predefine.dto';

@Controller('predefine')
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('admin', 'moderator')
export class PredefineController extends BaseController {
  constructor(private service: PredefineService) {
    super();
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'moderator')
  @Get()
  async GetAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('orderBy') orderType: 'ASC' | 'DESC',
  ) {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page)) page = 1;
    if (isNaN(limit)) limit = 20;
    if (orderType !== 'ASC' && orderType !== 'DESC') orderType = 'ASC';
    const result = this.service.findAll(page, limit);
    return result;
  }
  @Get('/:Predefine_Group/:Predefine_CD')
  async getByID(
    @Param('Predefine_Group') Predefine_Group: string,
    @Param('Predefine_CD') Predefine_CD: string,
  ) {
    return {
      status: 0,
      data: await this.service.getByID(Predefine_Group, Predefine_CD),
    };
  }

  @Post('search/where/store')
  async search(@Body() predefineDto: PredefineDto) {
    // console.log('fine predefineDto');

    return this.service.search(predefineDto);
  }

  // @Post()
  // async addPredefine(@Body() data: co_Predefine) {
  //   try {
  //     var create = await this.service.addPredefine(data);
  //     return create;
  //   } catch (error) {
  //     return { status: 2, message: error.message };
  //   }
  // }

  // @Put()
  // async updatePredefine(@Body() data: co_Predefine) {
  //   try {
  //     var is_success = await this.service.updatePredefine(data);
  //     if (is_success) {
  //       console.log('is success', is_success);

  //       return { status: 0 };
  //     } else {
  //       return { status: 1 };
  //     }
  //   } catch (error) {
  //     return { status: 2 };
  //   }
  // }

  // @Delete('/:Predefine_Group/:Predefine_CD')
  // async deleteatePredefine(
  //   @Param('Predefine_Group') Predefine_Group: string,
  //   @Param('Predefine_CD') Predefine_CD: string,
  // ) {
  //   try {
  //     var is_success = await this.service.deletePredefine(
  //       Predefine_Group,
  //       Predefine_CD,
  //     );
  //     if (is_success) {
  //       return { status: 0 };
  //     } else {
  //       return { status: 1 };
  //     }
  //   } catch (error) {
  //     return { status: 2 };
  //   }
  // }

  // =================================================

  @Post()
  async create(@Body() data: PredefineDto, @Res() res: Response) {
    try {
      const result = await this.service.create(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Put()
  async update(
    @Body() data: PredefineDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    try {
      data.updateBy = req.user.userId;
      const result = await this.service.update(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Delete()
  async delete(@Body() data: PredefineDto, @Res() res: Response) {
    try {
      const result = await this.service.delete(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Get('group/:groupName')
  async findByQuery(
    @Param('groupName') groupName: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.findByGroup(groupName);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
}
