import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import {
  ProductionDailyVolumnRecordDto,
  ProductionDailyVolumnRecordShift,
} from './dto/production-daily-volumn-record.dto';
@Injectable()
export class ProductionDailyVolumnRecordService {
  constructor(private commonService: CommonService) {}

  async search(dto: ProductionDailyVolumnRecordSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Date', dto.date);
    req.input('Line', dto.line);
    req.input('Grade', dto.grade);
    req.input('ProductName', dto.productName);

    return await this.commonService.getSearch('sp_search_prod_daily', req);
  }

  async readExcelFile(buffer: Buffer) {
    var dto = new ProductionDailyVolumnRecordDto();

    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Assuming you want to read the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets['PD_DAILY_VOLUME'];
    const shift1 = new ProductionDailyVolumnRecordShift();

    shift1.Shift = worksheet['B13'] ? worksheet['B13'].v : null;
    shift1.Shift_Start = worksheet['H23'] ? worksheet['H23'].w : null;
    shift1.Shift_End = worksheet['I23'] ? worksheet['I23'].w : null;

    // ตาราง Feedstock Oil Consumption
    shift1.T1_Production_EBO = worksheet['C13'] ? worksheet['C13'].v : null;
    shift1.T1_Production_CBO = worksheet['D13'] ? worksheet['D13'].v : null;
    shift1.T1_Production_FCC = worksheet['E13'] ? worksheet['E13'].v : null;
    shift1.T1_Production_Prod_Total = worksheet['F13']
      ? worksheet['F13'].v
      : null;

    shift1.T1_EKINEN_EBO = worksheet['G13'] ? worksheet['G13'].v : null;
    shift1.T1_EKINEN_CBO = worksheet['H13'] ? worksheet['H13'].v : null;
    shift1.T1_EKINEN_FCC = worksheet['I13'] ? worksheet['I13'].v : null;
    shift1.T1_EKINEN_EKN_Total = worksheet['J13'] ? worksheet['J13'].v : null;

    shift1.T1_EKINEN_FS_Oil_All_CBO =
      shift1.T1_Production_CBO + shift1.T1_EKINEN_CBO;
    shift1.T1_EKINEN_FS_Oil_All_EBO =
      shift1.T1_Production_EBO + shift1.T1_EKINEN_EBO;
    shift1.T1_EKINEN_FS_Oil_All_FCC =
      shift1.T1_Production_FCC + shift1.T1_EKINEN_FCC;
    shift1.T1_EKINEN_FS_Oil_All_Total =
      shift1.T1_Production_Prod_Total + shift1.T1_EKINEN_EKN_Total;

    //ตาราง FUEL

    shift1.T2_NG_Production = worksheet['M13'] ? worksheet['M13'].v : null;
    shift1.T2_NG_Warm_up = worksheet['N13'] ? worksheet['N13'].v : null;
    shift1.T2_NG_Preheat = worksheet['O13'] ? worksheet['O13'].v : null;
    shift1.T2_EBO_Preheat = worksheet['S13'] ? worksheet['S13'].v : null;
    shift1.T2_CBO_Preheat = worksheet['T13'] ? worksheet['T13'].v : null;
    shift1.T2_FCC_Preheat = worksheet['U13'] ? worksheet['U13'].v : null;
    shift1.T2_NG_Oil_Spray_checking = worksheet['Q13']
      ? worksheet['Q13'].v
      : null;

    shift1.T3_Mixing_Other = worksheet['V13'] ? worksheet['V13'].v : null;
    shift1.T3_Hoist_Other = worksheet['X13'] ? worksheet['X13'].v : null;
    shift1.T3_Kande_Other = worksheet['Z13'] ? worksheet['Z13'].v : null;
    shift1.T3_Discharged_Volume_Other = worksheet['AD13']
      ? worksheet['AD13'].v
      : null;

    shift1.T3_KOH_Mixing_Other = worksheet['AF13'] ? worksheet['AF13'].v : null;
    shift1.T3_NaOH_Consumption_Other = worksheet['AH13']
      ? worksheet['AH13'].v
      : null;

    dto.shifts = [shift1];

    return dto;
  }
}
