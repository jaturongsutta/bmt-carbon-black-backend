import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('um_User_Role')
export class UserRole {
  @PrimaryGeneratedColumn({ name: 'User_Role_ID', type: 'int' })
  userRoleId: number;

  @Column({ name: 'User_ID', type: 'int' })
  userId: number;

  @Column({ name: 'Role_ID', type: 'int' })
  roleId: number;

  @Column({ name: 'Is_Active', type: 'char', length: 1, nullable: true })
  isActive: string;

  @Column({ name: 'Created_By', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'Created_Date', type: 'datetime', nullable: true })
  createdDate: Date;

  @Column({ name: 'Updated_by', type: 'int', nullable: true })
  updatedBy: number;

  @UpdateDateColumn({ name: 'Updated_Date', type: 'datetime', nullable: true })
  updatedDate: Date;
}
