import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('um_Menu')
export class Menu {
  @PrimaryColumn({ length: 10, name: 'Menu_No' })
  menuNo: string;

  @Column({ length: 255, name: 'Menu_Name_TH' })
  menuNameTH: string;

  @Column({ length: 255, name: 'Menu_Name_EN' })
  menuNameEN: string;

  @Column({ length: 255, name: 'URL' })
  url: string;

  @Column({ length: 10, name: 'Menu_Group' })
  menuGroup: string;

  @Column({ name: 'Menu_Icon' })
  menuIcon: string;

  @Column({ length: 1, name: 'Is_MainMenu' })
  isMainMenu: string;

  @Column({ length: 1, name: 'Is_Active' })
  isActive: string;

  @Column({ name: 'Menu_Seq', type: 'int' })
  menuSeq: number;

  @Column({ name: 'Created_By', type: 'int' })
  createdBy: number;

  @CreateDateColumn({ name: 'Created_Date', type: 'datetime' })
  createdDate: Date;

  @Column({ name: 'Updated_by', type: 'int' })
  updatedBy: number;

  @UpdateDateColumn({ name: 'Updated_Date', type: 'datetime' })
  updatedDate: Date;
}
