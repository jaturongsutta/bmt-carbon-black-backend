import { Body, Controller, Post } from '@nestjs/common';
import { TankShippingService } from './tank-shipping.service';
import { TankShippingDto } from './dto/tank-shipping.dto';
import { BaseController } from 'src/base.controller';

@Controller('tank-shipping')
export class TankShippingController extends BaseController {
  constructor(private service: TankShippingService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: TankShippingDto) {
    return await this.service.search(dto);
  }
}
