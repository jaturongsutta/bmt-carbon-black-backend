import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPredefineData1726026802492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO co_Predefine (Predefine_Group, Predefine_CD, Description, Value_TH, Value_EN, Is_Active, Create_By, Create_Date, Update_By, Update_Date)
      VALUES 
      ('Group1', 'CD1', 'Description1', 'ValueTH1', 'ValueEN1', '1', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP),
      ('Group2', 'CD2', 'Description2', 'ValueTH2', 'ValueEN2', '1', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP),
      ('Group3', 'CD3', 'Description3', 'ValueTH3', 'ValueEN3', '1', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM co_Predefine WHERE Predefine_Group IN ('Group1', 'Group2', 'Group3') AND Predefine_CD IN ('CD1', 'CD2', 'CD3');
    `);
  }
}
