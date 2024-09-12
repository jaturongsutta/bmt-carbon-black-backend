import { RolePermission } from 'src/entity/role-permission.entity';

export class RoleDto {
  Role_ID: number;

  Role_Name_TH: string;

  Role_Name_EN: string;

  Is_Active: string;

  UserLogin: string;

  Update_By: number;

  Update_Date: Date;

  rowNum: number;

  items: Array<RolePermission>;
}
