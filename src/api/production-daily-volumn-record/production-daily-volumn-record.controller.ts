import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoSystemParametersService } from '../co-system-parameters/co-system-parameters.service';

@Controller('production-daily-volumn-record')
export class ProductionDailyVolumnRecordController {
  constructor(
    private service: ProductionDailyVolumnRecordService,
    private coSystemParameterService: CoSystemParametersService,
  ) {
    // super();
  }

  @Post('search')
  async search(@Body() dto: ProductionDailyVolumnRecordSearchDto) {
    return await this.service.search(dto);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,

    @UploadedFile() file: Express.Multer.File,
  ) {
    // const data = await this.coSystemParameterService.findbyType('DIR_COA');
    // const directoryPath = data.paramValue;
    // const savePath = path.join(directoryPath, dto.filename);

    try {
      // // Ensure the directory exists
      // if (!fs.existsSync(directoryPath)) {
      //   fs.mkdirSync(directoryPath, { recursive: true });
      // }
      // fs.writeFileSync(savePath, file.buffer);

      return this.service.readExcelFile(file.buffer);

      // return {
      //   status: 0,
      // };
    } catch (error) {
      console.log('error : ', error);
      return {
        status: 2,
        message: error.message,
      };
    }
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
