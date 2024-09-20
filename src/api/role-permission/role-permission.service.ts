import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Role } from 'src/entity/role.entity';
import { Repository } from 'typeorm';
import { RoleSearchDto } from './dto/role-search.dto';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private commonService: CommonService,
  ) {}

  async search(data: RoleSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Role_Name_EN', data.roleNameEn ? data.roleNameEn : null);
    req.input('Role_Name_TH', data.roleNameTh ? data.roleNameTh : null);
    req.input('Status', data.status ? data.status : null);
    req.input('Row_No_From', data.searchOptions.rowFrom);
    req.input('Row_No_To', data.searchOptions.rowTo);
    return this.commonService.getSearch('sp_um_Search_Role', req);
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
}
