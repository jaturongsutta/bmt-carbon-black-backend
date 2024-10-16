import { BaseSearch } from 'src/common/base-search';

export class TankShippingDto extends BaseSearch {
  tank: string;
  product: string;
  date: string;
}
