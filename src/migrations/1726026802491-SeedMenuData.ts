import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMenuData1726026802491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO um_Menu (Menu_No, Menu_Seq, Menu_Name_EN, Menu_Name_TH, URL, Menu_Group, Menu_Icon, Is_MainMenu, Is_Active, Created_By, Created_Date, Updated_by, Updated_Date)
      VALUES 
        ('M1000', 1, 'Common Master', 'ข้อมูลพื้นฐาน', NULL, NULL, 'mdi-cog', 'Y', 'Y', 1, GETDATE(), NULL, GETDATE()),
        ('M1001', 1, 'User', 'ผู้ใช้งาน', '/user', 'M1000', NULL, 'N', 'Y', 1, GETDATE(), 1, GETDATE()),
        ('M1002', 2, 'Role Permission', 'สิทธิการใช้งาน', '/role-permission', 'M1000', NULL, 'N', 'Y', 1, GETDATE(), NULL, GETDATE()),
        ('M1003', 3, 'Predefine', 'Predefine', '/predefine', 'M1000', NULL, 'N', 'Y', 1, GETDATE(), NULL, GETDATE()),
        ('M1004', 4, 'Menu', 'เมนู', '/menu', 'M1000', NULL, 'N', 'Y', 1, GETDATE(), NULL, GETDATE()),
        ('M1005', 5, 'Log', 'Log', '/log', 'M1000', NULL, 'N', 'Y', 1, GETDATE(), NULL, GETDATE());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM um_Menu WHERE Menu_No IN ('M1000', 'M1001', 'M1002', 'M1003','M1004','M1005');
    `);
  }
}
