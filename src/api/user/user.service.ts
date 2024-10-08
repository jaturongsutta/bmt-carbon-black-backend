import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserSearchDto } from './dto/user-search.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private commonService: CommonService,
  ) {}

  async getByID(id: number): Promise<UserDto> {
    const dto = new UserDto();

    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      dto.result.status = 2;
      dto.result.message = 'User not found';
      return dto;
    }

    Object.assign(dto, user);
    return dto;
  }

  getByLogin(username: string, password: string): Promise<User> {
    return this.userRepository.findOneBy({
      username: username,
      userPassword: password,
    });
  }

  async search(dto: UserSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('User_Name', dto.username);
      req.input('First_Name', dto.firstName);
      req.input('Last_Name', dto.lastName);
      req.input('Status', dto.status);
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      const result = await this.commonService.getSearch(
        'sp_um_Search_User',
        req,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  async addUser(data: UserDto): Promise<User> {
    console.log('data', data);
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async updateUser(id: number, data: UserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async changePassword(data: UserChangePasswordDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('User_ID', data.userId);
      req.input('Change_By_Admin', data.changeByAdmin);
      req.input('Old_Password', data.oldPassword);
      req.input('New_Password', data.newPassword);
      req.input('Created_By', data.createdBy);

      req.output('Return_CD', '');
      const result = await this.commonService.executeStoreProcedure(
        'sp_Change_Password',
        req,
      );

      return result.output.Return_CD;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  async deleteUser(id: number): Promise<BaseResponse> {
    const r = await this.userRepository.delete({ userId: id });
    if (r.affected > 0) return { status: 0 };
    else return { status: 1 };
  }

  async getMenuByUserID(
    userID: number,
    password: string,
    menuType: number,
    lang: string,
  ) {
    const req = await this.commonService.getConnection();
    req.input('User_ID', userID);
    req.input('Password', password);
    req.input('Manu_Type', menuType);
    req.input('Language', lang);
    req.output('Return_CD', '');

    const execute = await this.commonService.executeStoreProcedure(
      'sp_User_Role_Permission',
      req,
    );

    let res;
    if (execute && execute.recordset !== undefined) {
      res = {
        result: true,
        data: execute.recordset,
      };
    } else {
      res = {
        result: false,
      };
    }

    return res;
  }
}
