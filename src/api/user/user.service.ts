import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserSearchDto } from './dto/user-search.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private commonService: CommonService,
  ) {}

  async findUserById(userID: number): Promise<User | null> {
    // Assuming there's a User model with a static method findOne that accepts a query object
    const user = await this.userRepository.findOne({ where: { userID } });
    if (!user) {
      return null;
    }
    return user;
  }

  async getByID(id: number) {
    try {
      const req = await this.commonService.getConnection();
      req.input('User_ID', id);
      const query = await this.commonService.executeStoreProcedure(
        'sp_um_Search_User_By_ID',
        req,
      );
      // console.log('userId recordsets', query);

      return query.recordset;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // getByID(id: number): Promise<User> {
  //   return this.userRepository.findOneBy({ userID: id });
  // }

  getByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username: username });
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
      req.input('Row_No_To', dto.searchOptions.rowFrom);

      const result = await this.commonService.executeStoreProcedure(
        'sp_um_Search_User',
        req,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addUser(data: UserDto) {
    try {
      const newListRole = JSON.stringify(data.listRow);
      const req = await this.commonService.getConnection();
      req.input('User_Name', data.username);
      req.input('Password', data.password);
      req.input('First_Name', data.firstName);
      req.input('Last_Name', data.lastName);
      req.input('Position_Name', data.positionName);
      req.input('Status', data.status);
      req.input('List_Role', newListRole);
      req.input('Created_By', data.createdBy);
      req.output('Return_CD', '');
      const result = await this.commonService.executeStoreProcedure(
        'sp_Add_User',
        req,
      );

      return result.output.Return_CD;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(data: UserDto) {
    const newListRole = JSON.stringify(data.listRow);

    try {
      const req = await this.commonService.getConnection();
      req.input('User_ID', data.userId);
      req.input('User_Name', data.username);
      req.input('First_Name', data.firstName);
      req.input('Last_Name', data.lastName);
      req.input('Position_Name', data.positionName);
      req.input('Status', data.status);
      req.input('List_Role', newListRole);
      req.input('Created_By', data.createdBy);
      req.output('Return_CD', '');
      const result = await this.commonService.executeStoreProcedure(
        'sp_Edit_User',
        req,
      );
      // console.log('sp_Edit_User', result.output.Return_CD);

      return result.output.Return_CD;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
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

  async deleteUser(id: number): Promise<boolean> {
    const r = await this.userRepository.delete({ userID: id });
    return r.affected > 0;
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
