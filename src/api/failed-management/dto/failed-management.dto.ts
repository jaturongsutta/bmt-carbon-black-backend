import { BaseDto } from 'src/common/base-dto';

export class FailedManagementDto extends BaseDto {
  month: string;
  year: string;
  line: string;
  productName: string;
}
