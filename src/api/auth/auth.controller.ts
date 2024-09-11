import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptData } from 'src/_services/encrypt';
import { LoginDto } from './dto/login.dto';
import { UserLoginDto } from './dto/user-login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: LoginDto): Promise<UserLoginDto> {
    const hashPassword = EncryptData.hash(body.password);
    return this.authService.signin(body.username, hashPassword);
  }
}
