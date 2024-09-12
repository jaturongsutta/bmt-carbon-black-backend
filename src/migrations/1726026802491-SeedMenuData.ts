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

    await queryRunner.query(`
        SET IDENTITY_INSERT um_Menu_Route ON;
      INSERT INTO um_Menu_Route (Menu_Route_ID, Menu_No, Route_Name, Route_Path, Physical_Path, Is_Require_Auth)
      VALUES 
        (1, 'M1001', 'user', '/user', 'user/user-list.vue', 1),
        (2, 'M1001', 'user-info', '/user-info', 'user/user-info.vue', 1),
        (3, 'M1002', 'role-permission', '/role-permission', 'role-permission/role-permission.vue', 1),
        (4, 'M1003', 'predefine', '/predefine', 'predefine/predefine.vue', 1),
        (5, 'M1004', 'menu', '/menu', 'menu/menu-list.vue', 1),
        (6, 'M1004', 'menu-info', '/menu-info', 'menu/menu-info.vue', 1),
        (7, 'M1005', 'app-log', '/app-log', 'app-log/app-log.vue', 1);

        SET IDENTITY_INSERT um_Menu_Route OFF;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM um_Menu WHERE Menu_No IN ('M1000', 'M1001', 'M1002', 'M1003','M1004','M1005');
      DELETE FROM um_Menu_Route WHERE Menu_No IN ('M1000', 'M1001', 'M1002', 'M1003','M1004','M1005');
    `);
  }
}
