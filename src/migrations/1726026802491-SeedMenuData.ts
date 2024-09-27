import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMenuData1726026802491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO um_Menu (Menu_No, Menu_Seq, Menu_Name_EN, Menu_Name_TH, URL, Menu_Group, Menu_Icon, Is_MainMenu, Is_Active, Created_By, Created_Date, Updated_by, Updated_Date)
      VALUES 
        ('M1000', 1, 'Common Master', 'ข้อมูลพื้นฐาน', NULL, NULL, 'mdi-cog', 'Y', 'Y', 1, '2567-09-12 07:17:12.160', NULL, '2567-09-12 07:17:12.160'),
        ('M1001', 1, 'User', 'ผู้ใช้งาน', '/user', 'M1000', NULL, 'N', 'Y', 1, '2567-09-12 07:17:12.160', 1, '2567-09-12 07:17:12.160'),
        ('M1002', 2, 'Role Permission', 'สิทธิการใช้งาน', '/role-permission', 'M1000', NULL, 'N', 'Y', 1, '2567-09-12 07:17:12.160', NULL, '2567-09-12 07:17:12.160'),
        ('M1003', 3, 'Predefine', 'Predefine', '/predefine', 'M1000', NULL, 'N', 'Y', 1, '2567-09-12 07:17:12.160', NULL, '2567-09-12 07:17:12.160'),
        ('M1004', 4, 'Menu', 'เมนู', '/menu', 'M1000', NULL, 'N', 'Y', 1, '2567-09-12 07:17:12.160', NULL, '2567-09-12 07:17:12.160'),
        ('M1005', 5, 'Log', 'Log', '/application-log', 'M1000', NULL, 'N', 'Y', 1, '2567-09-12 07:17:12.160', NULL, '2567-09-12 07:17:12.160');
    `);

    await queryRunner.query(`
      SET IDENTITY_INSERT um_Menu_Route ON;
      INSERT INTO um_Menu_Route (Menu_Route_ID, Menu_No, Route_Name, Route_Path, Physical_Path, Is_Require_Auth, Is_Main)
      VALUES 
        (1, 'M1001', 'user', '/user', 'common-master/user/user-list.vue', 1,1),
        (2, 'M1001', 'user-info', '/user-info', 'common-master/user/user-info.vue', 1,0),
        (3, 'M1002', 'role-permission', '/role-permission', 'common-master/role-permission/role-permission.vue', 1,1),
        (4, 'M1003', 'predefine', '/predefine', 'common-master/predefine/predefine.vue', 1,1),
        (5, 'M1004', 'menu', '/menu', 'common-master/menu/menu-list.vue', 1,1),
        (6, 'M1004', 'menu-info', '/menu-info', 'common-master/menu/menu-info.vue', 1,0),
        (7, 'M1005', 'application-log', '/application-log', 'common-master/application-log/log-list.vue', 1,1),
        (8, 'M1005', 'application-log-preview', '/application-log-preview', 'common-master/application-log/preview-log.vue', 1,1);
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
