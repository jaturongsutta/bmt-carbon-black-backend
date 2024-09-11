import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('um_Role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'Role_ID', type: 'int' })
  roleID: number;

  @Column({ name: 'Role_Name_TH', length: 200 })
  roleNameTH: string;

  @Column({ name: 'Role_Name_EN', length: 200 })
  roleNameEN: string;

  @Column({ name: 'Is_Active', length: 1 })
  isActive: string;

  @Column({ name: 'Create_By', type: 'int' })
  createBy: number;

  @CreateDateColumn({ name: 'Create_Date', type: 'datetime' })
  createDate: Date;

  @Column({ name: 'Update_By', type: 'int' })
  updateBy: number;

  @UpdateDateColumn({ name: 'Update_Date', type: 'datetime' })
  updateDate: Date;

  @OneToMany(() => RolePermission, (role) => role.roleID)
  umRolePermission: RolePermission[];
}
