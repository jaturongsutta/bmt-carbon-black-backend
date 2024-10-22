import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
import {
  ProductionDailyVolumnRecordDto,
  ProductionDailyVolumnRecordShift,
} from './dto/production-daily-volumn-record.dto';
import { BaseResponse } from 'src/common/base-response';
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

  async add(
    data: ProductionDailyVolumnRecordDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const shift1 = this.getMappingData(data, data.shifts[0]);
      const shift2 = this.getMappingData(data, data.shifts[1]);
      const shift3 = this.getMappingData(data, data.shifts[2]);

      const itemData = [...shift1, ...shift2, ...shift3];

      const listFileUpload = JSON.stringify(itemData);
      let req = await this.commonService.getConnection();
      req.input('Date', data.date);
      req.input('Line', data.line);
      req.input('Grade', data.grade);
      req.input('ProductName', data.productName);
      req.input('FileName', data.filename);
      req.input('ListFileUpload', listFileUpload);

      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_add_tank_shipping',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async readExcelFile(buffer: Buffer) {
    var dto = new ProductionDailyVolumnRecordDto();

    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      // Assuming you want to read the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets['PD_DAILY_VOLUME'];

      const shift1 = this.getShift1(worksheet);
      console.log('shift1ed');
      const shift2 = this.getShift2(worksheet);
      console.log('shift2ed');

      const shift3 = this.getShift3(worksheet);
      console.log('shift3ed');

      dto.shifts = [shift1, shift2, shift3];
    } catch (error) {
      dto.result.status = 2;
      dto.result.message = error.message;
    }
    return dto;
  }

  getShift1(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = worksheet['B13'] ? worksheet['B13'].v : null;
    shift.Shift_Start = worksheet['H23'] ? worksheet['H23'].w : null;
    shift.Shift_End = worksheet['I23'] ? worksheet['I23'].w : null;

    if (shift.Shift_Start) {
      shift.Shift_Start = moment(shift.Shift_Start, 'HH:mm').format('HH:mm');
    }
    if (shift.Shift_End) {
      shift.Shift_End = moment(shift.Shift_End, 'HH:mm').format('HH:mm');
    }

    // Calculate the difference between Shift_Start and Shift_End
    if (shift.Shift_Start && shift.Shift_End) {
      const shiftStart = moment(shift.Shift_Start, 'HH:mm');
      const shiftEnd = moment(shift.Shift_End, 'HH:mm');
      const duration = moment.duration(shiftEnd.diff(shiftStart));
      const hours = duration.asHours();
      shift.Shift_Oper_Time = hours.toString();
    }

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = worksheet['C13'] ? worksheet['C13'].v : null;
    shift.T1_Production_CBO = worksheet['D13'] ? worksheet['D13'].v : null;
    shift.T1_Production_FCC = worksheet['E13'] ? worksheet['E13'].v : null;
    shift.T1_Production_Prod_Total = worksheet['F13']
      ? worksheet['F13'].v
      : null;

    shift.T1_EKINEN_EBO = worksheet['G13'] ? worksheet['G13'].v : null;
    shift.T1_EKINEN_CBO = worksheet['H13'] ? worksheet['H13'].v : null;
    shift.T1_EKINEN_FCC = worksheet['I13'] ? worksheet['I13'].v : null;
    shift.T1_EKINEN_EKN_Total = worksheet['J13'] ? worksheet['J13'].v : null;

    shift.T1_EKINEN_FS_Oil_All_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_EKINEN_FS_Oil_All_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_EKINEN_FS_Oil_All_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_EKINEN_FS_Oil_All_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    //ตาราง FUEL

    shift.T2_NG_Production = worksheet['M13'] ? worksheet['M13'].v : null;
    shift.T2_NG_Warm_up = worksheet['N13'] ? worksheet['N13'].v : null;
    shift.T2_NG_Preheat = worksheet['O13'] ? worksheet['O13'].v : null;
    shift.T2_EBO_Preheat = worksheet['S13'] ? worksheet['S13'].v : null;
    shift.T2_CBO_Preheat = worksheet['T13'] ? worksheet['T13'].v : null;
    shift.T2_FCC_Preheat = worksheet['U13'] ? worksheet['U13'].v : null;
    shift.T2_NG_Oil_Spray_checking = worksheet['Q13']
      ? worksheet['Q13'].v
      : null;

    shift.T3_Mixing_Other = worksheet['V13'] ? worksheet['V13'].v : null;
    shift.T3_Hoist_Other = worksheet['X13'] ? worksheet['X13'].v : null;
    shift.T3_Kande_Other = worksheet['Z13'] ? worksheet['Z13'].v : null;
    shift.T3_Discharged_Volume_Other = worksheet['AD13']
      ? worksheet['AD13'].v
      : null;

    shift.T3_KOH_Mixing_Other = worksheet['AF13'] ? worksheet['AF13'].v : null;
    shift.T3_NaOH_Consumption_Other = worksheet['AH13']
      ? worksheet['AH13'].v
      : null;

    return shift;
  }

  getShift2(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = worksheet['B14'] ? worksheet['B14'].v : null;
    shift.Shift_Start = worksheet['V23'] ? worksheet['V23'].w : null;
    shift.Shift_End = worksheet['W23'] ? worksheet['W23'].w : null;

    if (shift.Shift_Start) {
      shift.Shift_Start = moment(shift.Shift_Start, 'HH:mm').format('HH:mm');
    }
    if (shift.Shift_End) {
      shift.Shift_End = moment(shift.Shift_End, 'HH:mm').format('HH:mm');
    }

    // Calculate the difference between Shift_Start and Shift_End
    if (shift.Shift_Start && shift.Shift_End) {
      const shiftStart = moment(shift.Shift_Start, 'HH:mm');
      const shiftEnd = moment(shift.Shift_End, 'HH:mm');
      const duration = moment.duration(shiftEnd.diff(shiftStart));
      const hours = duration.asHours();
      shift.Shift_Oper_Time = hours.toString();
    }

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = worksheet['C14'] ? worksheet['C14'].v : null;
    shift.T1_Production_CBO = worksheet['D14'] ? worksheet['D14'].v : null;
    shift.T1_Production_FCC = worksheet['E14'] ? worksheet['E14'].v : null;
    shift.T1_Production_Prod_Total = worksheet['F14']
      ? worksheet['F14'].v
      : null;

    shift.T1_EKINEN_EBO = worksheet['G14'] ? worksheet['G14'].v : null;
    shift.T1_EKINEN_CBO = worksheet['H14'] ? worksheet['H14'].v : null;
    shift.T1_EKINEN_FCC = worksheet['I14'] ? worksheet['I14'].v : null;
    shift.T1_EKINEN_EKN_Total = worksheet['J14'] ? worksheet['J14'].v : null;

    shift.T1_EKINEN_FS_Oil_All_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_EKINEN_FS_Oil_All_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_EKINEN_FS_Oil_All_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_EKINEN_FS_Oil_All_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    //ตาราง FUEL

    shift.T2_NG_Production = worksheet['M14'] ? worksheet['M14'].v : null;
    shift.T2_NG_Warm_up = worksheet['N14'] ? worksheet['N14'].v : null;
    shift.T2_NG_Preheat = worksheet['O14'] ? worksheet['O14'].v : null;
    shift.T2_EBO_Preheat = worksheet['S14'] ? worksheet['S14'].v : null;
    shift.T2_CBO_Preheat = worksheet['T14'] ? worksheet['T14'].v : null;
    shift.T2_FCC_Preheat = worksheet['U14'] ? worksheet['U14'].v : null;
    shift.T2_NG_Oil_Spray_checking = worksheet['Q14']
      ? worksheet['Q14'].v
      : null;

    shift.T3_Mixing_Other = worksheet['V14'] ? worksheet['V14'].v : null;
    shift.T3_Hoist_Other = worksheet['X14'] ? worksheet['X14'].v : null;
    shift.T3_Kande_Other = worksheet['Z14'] ? worksheet['Z14'].v : null;
    shift.T3_Discharged_Volume_Other = worksheet['AD14']
      ? worksheet['AD14'].v
      : null;

    shift.T3_KOH_Mixing_Other = worksheet['AF14'] ? worksheet['AF14'].v : null;
    shift.T3_NaOH_Consumption_Other = worksheet['AH14']
      ? worksheet['AH14'].v
      : null;

    return shift;
  }

  getShift3(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = worksheet['B15'] ? worksheet['B15'].v : null;
    shift.Shift_Start = worksheet['AG23'] ? worksheet['AG23'].w : null;
    shift.Shift_End = worksheet['AH23'] ? worksheet['AH23'].w : null;

    if (shift.Shift_Start) {
      shift.Shift_Start = moment(shift.Shift_Start, 'HH:mm').format('HH:mm');
    }
    if (shift.Shift_End) {
      shift.Shift_End = moment(shift.Shift_End, 'HH:mm').format('HH:mm');
    }

    // Calculate the difference between Shift_Start and Shift_End
    if (shift.Shift_Start && shift.Shift_End) {
      const shiftStart = moment(shift.Shift_Start, 'HH:mm');
      const shiftEnd = moment(shift.Shift_End, 'HH:mm');
      const duration = moment.duration(shiftEnd.diff(shiftStart));
      const hours = duration.asHours();
      shift.Shift_Oper_Time = hours.toString();
    }

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = worksheet['C15'] ? worksheet['C15'].v : null;
    shift.T1_Production_CBO = worksheet['D15'] ? worksheet['D15'].v : null;
    shift.T1_Production_FCC = worksheet['E15'] ? worksheet['E15'].v : null;
    shift.T1_Production_Prod_Total = worksheet['F15']
      ? worksheet['F15'].v
      : null;

    shift.T1_EKINEN_EBO = worksheet['G15'] ? worksheet['G15'].v : null;
    shift.T1_EKINEN_CBO = worksheet['H15'] ? worksheet['H15'].v : null;
    shift.T1_EKINEN_FCC = worksheet['I15'] ? worksheet['I15'].v : null;
    shift.T1_EKINEN_EKN_Total = worksheet['J15'] ? worksheet['J15'].v : null;

    shift.T1_EKINEN_FS_Oil_All_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_EKINEN_FS_Oil_All_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_EKINEN_FS_Oil_All_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_EKINEN_FS_Oil_All_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    //ตาราง FUEL

    shift.T2_NG_Production = worksheet['M15'] ? worksheet['M15'].v : null;
    shift.T2_NG_Warm_up = worksheet['N15'] ? worksheet['N15'].v : null;
    shift.T2_NG_Preheat = worksheet['O15'] ? worksheet['O15'].v : null;
    shift.T2_EBO_Preheat = worksheet['S15'] ? worksheet['S15'].v : null;
    shift.T2_CBO_Preheat = worksheet['T15'] ? worksheet['T15'].v : null;
    shift.T2_FCC_Preheat = worksheet['U15'] ? worksheet['U15'].v : null;
    shift.T2_NG_Oil_Spray_checking = worksheet['Q15']
      ? worksheet['Q15'].v
      : null;

    shift.T3_Mixing_Other = worksheet['V15'] ? worksheet['V15'].v : null;
    shift.T3_Hoist_Other = worksheet['X15'] ? worksheet['X15'].v : null;
    shift.T3_Kande_Other = worksheet['Z15'] ? worksheet['Z15'].v : null;
    shift.T3_Discharged_Volume_Other = worksheet['AD15']
      ? worksheet['AD15'].v
      : null;

    shift.T3_KOH_Mixing_Other = worksheet['AF15'] ? worksheet['AF15'].v : null;
    shift.T3_NaOH_Consumption_Other = worksheet['AH15']
      ? worksheet['AH15'].v
      : null;

    return shift;
  }

  getMappingData(hdData: any, shift: ProductionDailyVolumnRecordShift) {
    let data = [];
    var d = {};

    /*  
     "Raw_Material_Type_Id": 
     Feedstock Oil Consumption  = 1,  
     FUEL =2, 
     Summarize Carbon, KOH Mixing (Litres),NaOH Consumption (Litres) ,Recycle Hopper Level (%) = 3, 
     Storage Tank = 4
     */

    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_Production_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_Production_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_Production_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'Prod_Total';
    d['Value'] = shift.T1_Production_Prod_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_EKINEN_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_EKINEN_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_EKINEN_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'EKN_Total';
    d['Value'] = shift.T1_EKINEN_EKN_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FS_Oil_All_EBO';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FS_Oil_All_CBO';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FS_Oil_All_FCC';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FS_Oil_All_Total';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION+EKINEN';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION+EKINEN';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION+EKINEN';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION+EKINEN';
    d['Category'] = 'Total';
    d['Value'] = shift.T1_EKINEN_FS_Oil_All_Total;
    data.push(d);

    // FUEL
    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Production';
    d['Value'] = shift.T2_NG_Production;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Production_Total';
    d['Value'] = shift.T2_NG_Production_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Warm_up';
    d['Value'] = shift.T2_NG_Warm_up;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Warm up_Total';
    d['Value'] = shift.T2_NG_Warm_up_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Preheat';
    d['Value'] = shift.T2_NG_Preheat;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Preheat_Total';
    d['Value'] = shift.T2_Preheat_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Drying';
    d['Value'] = shift.T2_NG_Drying;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Drying_Total';
    d['Value'] = shift.T2_NG_Drying_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Oil_Spray_checking';
    d['Value'] = shift.T2_NG_Oil_Spray_checking;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Oil Spray checking_Total';
    d['Value'] = shift.T2_NG_Oil_Spray_checking_Total;
    data.push(d);

    // Summarize Carbon, KOH Mixing (Litres),NaOH Consumption (Litres) ,Recycle Hopper Level (%)
    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Mixing';
    d['Category'] = null;
    d['Value'] = shift.T3_Mixing_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Hoist';
    d['Category'] = null;
    d['Value'] = shift.T3_Hoist_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Kande';
    d['Category'] = null;
    d['Value'] = shift.T3_Kande_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Discharged_Volume';
    d['Category'] = null;
    d['Value'] = shift.T3_Discharged_Volume_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'KOH_Mixing';
    d['Category'] = null;
    d['Value'] = shift.T3_KOH_Mixing_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'NaOH_Consumption';
    d['Category'] = null;
    d['Value'] = shift.T3_NaOH_Consumption_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Recycle_Hopper_Level';
    d['Category'] = null;
    d['Value'] = shift.T3_Recycle_Hopper_Level_Other;
    data.push(d);

    data.map((item) => {
      item['Shift'] = shift.Shift;
      item['Operating_Time'] = shift.Shift_Oper_Time;
      item['Shift_Start'] = shift.Shift_Start;
      item['Shift_End'] = shift.Shift_End;
    });

    return data;
  }
}
