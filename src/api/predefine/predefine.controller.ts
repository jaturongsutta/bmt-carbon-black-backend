import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { PredefineService } from './predefine.service';
import { Response } from 'express';
import { PredefineDto } from './dto/predefine.dto';
import { PredefineSearchDto } from './dto/predefine.search.dto';

@Controller('predefine')
export class PredefineController {
  constructor(private service: PredefineService) {}

  @Post('search')
  async search(
    @Body() predefineSearchDto: PredefineSearchDto,
    @Res() res: Response,
  ) {
    const predefines = await this.service.search(predefineSearchDto);
    return res.status(200).json(predefines);
  }

  @Post()
  async create(@Body() predefineDto: PredefineDto, @Res() res: Response) {
    const predefine = await this.service.create(predefineDto);
    return res.status(201).json(predefine);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const predefines = await this.service.findAll();
    return res.status(200).json(predefines);
  }

  @Get(':predefineGroup/:predefineCd')
  async findOne(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Res() res: Response,
  ) {
    const predefine = await this.service.findOne(predefineGroup, predefineCd);
    return res.status(200).json(predefine);
  }

  @Put(':predefineGroup/:predefineCd')
  async update(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Body() predefineDto: PredefineDto,
    @Res() res: Response,
  ) {
    const updatedPredefine = await this.service.update(
      predefineGroup,
      predefineCd,
      predefineDto,
    );
    return res.status(200).json(updatedPredefine);
  }

  @Delete(':predefineGroup/:predefineCD')
  async remove(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCD') predefineCD: string,
    @Res() res: Response,
  ) {
    await this.service.remove(predefineGroup, predefineCD);
    return res.status(204).send();
  }
}
