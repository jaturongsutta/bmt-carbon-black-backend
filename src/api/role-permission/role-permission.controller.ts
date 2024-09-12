import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { RolePermissionService } from './role-permission.service';
import { Response } from 'express';
import { RoleSearchDto } from './dto/role-search.dto';
import { RoleDto } from './dto/role.dto';
import { Role } from 'src/entity/role.entity';
import { RoleAssignDto } from './dto/role-assign.dto';
@Controller('role-permission')
export class RolePermissionController extends BaseController {
  constructor(private rolePermissionService: RolePermissionService) {
    super();
  }

  @Get('search/where')
  async search(
    @Query() roleSearchDto: RoleSearchDto,
    @Query('page') page: number,
    @Query('take') take: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolePermissionService.search(
        roleSearchDto,
        page,
        take,
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.rolePermissionService.searchRoleById(id);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Get('loadRolePermission/:roleId/:language')
  async loadRolePermission(
    @Param('roleId') roleId: number,
    @Param('language') language: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.rolePermissionService.loadRolePermission(
        roleId,
        language,
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Post()
  async addRolePermission(
    @Request() req: any,
    @Body() role: Role,
    @Res() res: Response,
  ) {
    try {
      role.createBy = role.updateBy = req.user.userId;
      const result = await this.rolePermissionService.addRolePermission(role);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Put()
  async updateRolePermission(@Body() role: RoleDto) {
    try {
      // console.log(role);
      const is_success =
        await this.rolePermissionService.updateRolePermission(role);
      if (is_success) {
        return { status: 0 };
      } else {
        return { status: 1 };
      }
    } catch (error) {
      console.log(error);
      return { status: 2, message: error.message };
    }
  }

  @Post('create')
  async createRole(@Body() data: RoleSearchDto, @Res() res: Response) {
    try {
      const result = await this.rolePermissionService.createRole(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Put('update')
  async editRole(@Body() data: RoleSearchDto, @Res() res: Response) {
    try {
      const result = await this.rolePermissionService.editRole(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Get('permission/:roleId')
  async searchPermissionById(
    @Param('roleId') roleId: string,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.rolePermissionService.searchRolePermissionById(roleId);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Post('assign')
  async assignPermission(@Body() data: RoleAssignDto, @Res() res: Response) {
    try {
      const result =
        await this.rolePermissionService.assignRolePermission(data);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }

  @Get('assign/list-role')
  async listRole(@Res() res: Response) {
    try {
      const result = await this.rolePermissionService.listRole();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
}
