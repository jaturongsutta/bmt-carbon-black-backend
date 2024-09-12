import { BaseSearch } from 'src/common/base-search';

export class PredefineDto extends BaseSearch {
  predefineGroup: string;

  predefineCD: string;

  description: string;

  valueTH: string;

  valueEN: string;

  isActive: string;

  createBy: number;

  createDate: Date;

  updateBy: number;

  updateDate: Date;
}
