import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('co_Predefine')
export class Predefine {
  @PrimaryColumn({ length: 20, name: 'Predefine_Group' })
  predefineGroup: string;

  @PrimaryColumn({ length: 20, name: 'Predefine_CD' })
  predefineCd: string;

  @Column({ length: 600, name: 'Description', nullable: true })
  description: string;

  @Column({ length: 600, name: 'Value_TH' })
  valueTh: string;

  @Column({ length: 600, name: 'Value_EN' })
  valueEn: string;

  @Column({ length: 1, name: 'Is_Active' })
  isActive: string;

  @Column({ name: 'Create_By', type: 'int', nullable: true })
  createBy: number;

  @CreateDateColumn({
    name: 'Create_Date',
    type: 'datetime',
    nullable: true,
    default: () => 'GETDATE()',
  })
  createDate: Date;

  @Column({ name: 'Update_By', type: 'int', nullable: true })
  updateBy: number;

  @UpdateDateColumn({
    name: 'Update_Date',
    type: 'datetime',
    nullable: true,
    default: () => 'GETDATE()',
    onUpdate: 'GETDATE()',
  })
  updateDate: Date;
}
