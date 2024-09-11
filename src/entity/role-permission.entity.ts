import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('um_Role_Permission')
export class RolePermission {
  @PrimaryColumn({ name: 'Role_ID', type: 'int' })
  roleID: number;

  @PrimaryColumn({ name: 'Menu_No', length: 5 })
  menuNo: string;

  @Column({ name: 'Can_Add', length: 1 })
  canAdd: string;

  @Column({ name: 'Can_Update', length: 1 })
  canUpdate: string;

  @Column({ name: 'Can_View', length: 1 })
  canView: string;

  @Column({ name: 'Is_Active', length: 1 })
  isActive: string;

  @Column({ name: 'Create_By', type: 'int' })
  createBy: number;

  @Column({ name: 'Create_Date', type: 'datetime' })
  createDate: Date;

  @Column({ name: 'Update_By', type: 'int' })
  updateBy: number;

  @Column({ name: 'Update_Date', type: 'datetime' })
  updateDate: Date;
}
