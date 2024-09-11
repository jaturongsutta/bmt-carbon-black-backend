import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
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
        const payload = { userId: user.userID, username: username };
        const token = await this.jwtService.signAsync(payload, tokenOptions);

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
}
