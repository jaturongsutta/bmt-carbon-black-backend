import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Role } from 'src/entity/role.entity';
import { Repository } from 'typeorm';
import { RoleSearchDto } from './dto/role-search.dto';
import { RoleDto } from './dto/role.dto';
import { RoleAssignDto } from './dto/role-assign.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private commonService: CommonService,
  ) {}

  async search(data: RoleSearchDto, page: number, take: number) {
    try {
      page = page ? page : 1;
      take = take ? take : 20;

      const from = 1 + Number(page - 1) * Number(take);
      const to = page * take;

      const req = await this.commonService.getConnection();
      req.input('Role_Name_EN', data.roleNameEn);
      req.input('Role_Name_TH', data.roleNameTh);
      req.input('Status', data.status);
      req.input('Row_No_From', from);
      req.input('Row_No_To', to);

      const query = await this.commonService.executeStoreProcedure(
        'sp_um_Search_Role',
        req,
      );

      if (query.recordsets.length == 0) {
        return [];
      }

      const totalItems = query.recordsets[1][0];

      const totalPage = Math.ceil(totalItems.Total_Record / take);

      const response = {
        items: query.recordsets[0],
        meta: {
          hasNextPage: page < totalPage,
          hasPreviousPage: page > 1,
          itemCount: totalItems.Total_Record,
          page,
          take,
          totalPage,
          totalItems: totalItems.Total_Record,
        },
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchOld(body: any) {
    try {
      console.log('request body', body);

      const req = await this.commonService.getConnection();
      req.input('Role_ID', body.roleId);
      // req.input('Menu_Name', body.Menu_Name);
      // req.input('Status', body.Status);
      // req.input('Language', 'TH');
      return this.commonService.getSearch('sp_um_Search_Role_Permission', req);
    } catch (error) {
      throw error;
    }
  }

  async loadRolePermission(roleId: number, language: string) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Role_ID', roleId);
      req.input('Language', language);
    } catch (error) {
      throw error;
    }
  }

  async addRolePermission(data: Role) {
    data.createDate = new Date();
    data.updateDate = new Date();
    const role = await this.roleRepository.save(data);
    for (let i = 0; i < role.rolePermissions.length; i++) {
      const rp = role.rolePermissions[i];
      rp.roleID = role.roleID;
      await this.rolePermissionRepository.save(rp);
    }

    return role;
  }

  async updateRolePermission(data: RoleDto) {
    data.Update_Date = new Date();

    for (let i = 0; i < data.items.length; i++) {
      const rp = data.items[i];
      rp.roleID = data.Role_ID;
      rp.updateBy = data.Update_By;
      rp.updateDate = new Date();
      await this.rolePermissionRepository.save(rp);
    }

    return true;
  }

  async listRole() {
    try {
      const sql = `SELECT Role_ID, Role_Name_EN FROM um_Role WHERE Is_Active = 'Y'`;
      const query = await this.rolePermissionRepository.query(sql);

      return query;
    } catch (error) {
      throw error;
    }
  }

  async createRole(data: RoleSearchDto) {
    try {
      const newRoleMenuList = JSON.stringify(data.roleMenuList);

      const req = await this.commonService.getConnection();
      req.input('Role_Name_EN', data.roleNameEn);
      req.input('Role_Name_TH', data.roleNameTh);
      req.input('Role_Menu_List', newRoleMenuList);
      req.input('Status', data.status);
      req.input('Created_By', data.createdBy);
      req.output('Return_CD', '');

      const query = await this.commonService.executeStoreProcedure(
        'sp_Add_Role',
        req,
      );

      return query.output.Return_CD;
    } catch (error) {
      throw error;
    }
  }

  async editRole(data: RoleSearchDto) {
    try {
      const newRoleMenuList = JSON.stringify(data.roleMenuList);
      const req = await this.commonService.getConnection();
      req.input('Role_ID', data.roleId);
      req.input('Role_Name_EN', data.roleNameEn);
      req.input('Role_Name_TH', data.roleNameTh);
      req.input('Role_Menu_List', newRoleMenuList);
      req.input('Status', data.status);
      req.input('Update_By', data.updatedBy);
      req.output('Return_CD', '');

      const query = await this.commonService.executeStoreProcedure(
        'sp_Edit_Role',
        req,
      );
      // console.log(query.output.Return_CD);
      return query.output.Return_CD;
    } catch (error) {
      throw error;
    }
  }

  async searchRoleById(roleId: string) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Role_ID', roleId);

      const query = await this.commonService.executeStoreProcedure(
        'sp_um_Search_Role_By_ID',
        req,
      );

      return query.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async searchRolePermissionById(roleId: string) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Role_ID', Number(roleId));

      const query = await this.commonService.executeStoreProcedure(
        'sp_um_Search_Role_Permission',
        req,
      );

      return query.recordset;
    } catch (error) {
      throw error;
    }
  }

  async assignRolePermission(data: RoleAssignDto) {
    try {
      const newRoleMenuList = JSON.stringify(data.roleMenuList);

      const req = await this.commonService.getConnection();
      req.input('Role_ID', data.roleId);
      req.input('Role_Menu_List', newRoleMenuList);
      req.input('Created_by', data.createdBy);
      req.output('Return_CD', '');

      const query = await this.commonService.executeStoreProcedure(
        'sp_Assign_Role_Permission',
        req,
      );

      return query.output.Return_CD;
    } catch (error) {
      throw error;
    }
  }
}
