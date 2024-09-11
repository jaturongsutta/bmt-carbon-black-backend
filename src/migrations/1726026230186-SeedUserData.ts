import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserData1726026230186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SET IDENTITY_INSERT um_User ON;

      INSERT INTO um_User (User_ID, Username, User_Password, First_Name, Last_Name, Position_Name, Is_Active, Create_By, Create_Date, Update_By, Update_Date)
      VALUES 
        (1, 'system', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Admin', 'User', 'Administrator', 'Y', 1, GETDATE(), 1, GETDATE()),
        (2, 'user', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Regular', 'User', 'Employee', 'Y', 1, GETDATE(), 1, GETDATE());

      SET IDENTITY_INSERT um_User OFF;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM um_User WHERE User_ID IN (1, 2);
    `);
  }
}
