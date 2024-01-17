import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const checkInfo = await this.usersService.attempt(email, pass);

    if (checkInfo.canReturnToken) {
      delete checkInfo.user.password;
    }

    return checkInfo;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      _id: user._id,
      roles: user.roles,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: parseInt(process.env.JWT_TTL),
      }),
    };
  }

  async register(registerDto: RegisterDto) {
    const result = await this.usersService.register(registerDto);

    return result;
  }
}
