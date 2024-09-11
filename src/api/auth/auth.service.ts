import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private commonService: CommonService,
  ) {}
  async signin(username: string, password: string): Promise<UserLoginDto> {
    const user = await this.userRepository.findOneBy({
      username: username,
      userPassword: password,
    });

    const userLoginDto = new UserLoginDto();
    const tokenOptions = { expiresIn: '30m' };
    if (user) {
      userLoginDto.user = user;
      if (user.isActive === 'Y') {
        const menus = await this.getMenuByUserID(
          user.userID,
          password,
          1,
          'EN',
        );

        const payload = { userId: user.userID, username: username };
        const token = await this.jwtService.signAsync(payload, tokenOptions);
        userLoginDto.menus = menus.data;
        userLoginDto.token = token;
        userLoginDto.result.status = 0;
      } else {
        userLoginDto.result.status = 1;
        userLoginDto.result.message = 'User is inactive';
      }
    } else {
      userLoginDto.result.status = 1;
      userLoginDto.result.message = 'Invalid username or password';
    }

    return userLoginDto;
  }

  async getMenuByUserID(
    userID: number,
    password: string,
    menuType: number,
    lang: string,
  ) {
    const req = await this.commonService.getConnection();
    req.input('User_ID', userID);
    req.input('Language', lang);
    req.output('Return_CD', '');

    const execute = await this.commonService.executeStoreProcedure(
      'sp_um_User_Role_Permission',
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
