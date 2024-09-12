import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStoreProcedure1726138099149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE PROCEDURE [dbo].[sp_um_Search_Menu]    
        @Menu_No NVARCHAR(5),    
        @Menu_Name NVARCHAR(100),     
        @Status CHAR(1),     
        @Language VARCHAR(2)    
      AS    
      BEGIN    
        SET NOCOUNT ON;    
        
        SELECT 
          mn.Menu_No,    
          mn.Menu_Name_TH,    
          mn.Menu_Name_EN,    
          mn.Menu_Seq,    
          mn.URL,    
          mn.Menu_Group,    
          dbo.fn_co_get_Predefine('Is_Active', mn.Is_Active, @Language) AS Status,    
          dbo.fn_um_get_Username(mn.Created_By) AS Create_By,    
          CONVERT(VARCHAR, mn.Created_Date, 103) AS Create_Date_Display,    
          dbo.fn_um_get_Username(mn.Updated_by) AS Update_By,    
          CONVERT(VARCHAR, mn.Updated_Date, 103) AS Update_Date_Display,    
          mn.Created_By,    
          mn.Updated_Date,    
          mn.Is_Active    
        FROM um_menu mn    
        WHERE 
          (mn.Menu_No LIKE '%' + ISNULL(@Menu_No, '') + '%' OR ISNULL(@Menu_No, '') = '')    
          AND (mn.Menu_Name_TH LIKE '%' + ISNULL(@Menu_Name, '') + '%' OR mn.Menu_Name_EN LIKE '%' + ISNULL(@Menu_Name, '') + '%' OR ISNULL(@Menu_Name, '') = '')    
          AND (mn.Is_Active = ISNULL(@Status, '') OR ISNULL(@Status, '') = '')    
        ORDER BY Menu_No;    
      END;
    `);

    await queryRunner.query(`
      CREATE FUNCTION [dbo].[fn_co_get_Predefine]    
      (   
        @Predefine_Group NVARCHAR(20),   
        @Predefine_CD  NVARCHAR(20),   
        @Language   NVARCHAR(10)   
      )   
      RETURNS NVARCHAR(300)   
      AS   
      BEGIN   
        DECLARE @Return_Value NVARCHAR(300) = '-';   
        
        SELECT @Return_Value = CASE WHEN @Language = 'EN' THEN ISNULL(Value_EN, '') ELSE ISNULL(Value_TH, '') END   
        FROM co_Predefine   
        WHERE Predefine_Group = @Predefine_Group   
          AND Predefine_CD = @Predefine_CD;   
        
        RETURN @Return_Value;   
      END;
    `);

    await queryRunner.query(`
      CREATE FUNCTION [dbo].[fn_um_get_Username]    
      (   
        @User_CD INT   
      )   
      RETURNS NVARCHAR(20)   
      AS   
      BEGIN   
        DECLARE @Return_Value NVARCHAR(20) = '-';   
        
        SELECT @Return_Value = Username   
        FROM um_User   
        WHERE [User_ID] = @User_CD;   
        
        RETURN @Return_Value;   
      END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP PROCEDURE [dbo].[sp_um_Search_Menu];
    `);

    await queryRunner.query(`
      DROP FUNCTION [dbo].[fn_co_get_Predefine];
    `);

    await queryRunner.query(`
      DROP FUNCTION [dbo].[fn_um_get_Username];
    `);
  }
}
