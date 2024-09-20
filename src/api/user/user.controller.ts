import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { EncryptData } from 'src/_services/encrypt';
import { UserChangePasswordDto } from './dto/user-change-password.dto';

@Controller('user')
export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  @Get(':id')
  getByID(@Param('id') id: number) {
    return this.userService.getByID(id);
  }

  @Post('search')
  async search(@Body() data: any) {
    try {
      const result = await this.userService.search(data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async addUser(@Body() data: UserDto) {
    data.password = EncryptData.hash(data.password);
    // console.log('data pass has', data);
    return this.userService.addUser(data);
  }

  @Put()
  async updateUser(@Request() req: any, @Body() data: UserDto) {
    try {
      const result = await this.userService.updateUser(data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Put('change-password')
  async changePass(@Body() data: UserChangePasswordDto) {
    try {
      data.oldPassword = EncryptData.hash(data.oldPassword);
      data.newPassword = EncryptData.hash(data.newPassword);

      const result = await this.userService.changePassword(data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteateUser(@Param('id') id: number) {
    try {
      const is_success = await this.userService.deleteUser(id);
      if (is_success) {
        return { status: 0 };
      } else {
        return { status: 1 };
      }
    } catch (error) {
      console.error(error);
      return { status: 2 };
    }
  }
}
