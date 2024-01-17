import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ERROR_CODES,
  USER_NOT_EXIST,
  WRONG_USER_OR_PASSWORD,
} from '../../constants/error-codes.constant';
import { UserStatus } from './user.enum';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from '../../enums/role.enum';
import { PaginationRequestFullDto } from '../../dtos/pagination-request.dto';
import { SortType } from '../../enums/sort.enum';
import { PaginationDto } from '../../dtos/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User> {
    const user = this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException({
        code: USER_NOT_EXIST,
        message: ERROR_CODES.get(USER_NOT_EXIST),
      });
    }

    return user;
  }

  async attempt(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    let result = {
      status: USER_NOT_EXIST,
      canReturnToken: false,
      user: null,
    };

    if (user) {
      const matchPassword = await this.comparePassword(password, user.password);

      if (matchPassword) {
        if (user.status === UserStatus.active) {
          result = { canReturnToken: true, user, status: user.status };
        } else {
          result = { canReturnToken: false, user, status: user.status };
        }
      } else {
        result = {
          canReturnToken: false,
          user,
          status: WRONG_USER_OR_PASSWORD,
        };
      }
    }

    return result;
  }

  async comparePassword(plainPass: string, password: string): Promise<boolean> {
    return await bcrypt.compare(plainPass, password);
  }

  async checkExist(email: string, userId = null): Promise<boolean> {
    const filter = { email: email };

    if (userId) {
      filter['_id'] = { $ne: userId };
    }

    const user = await this.userModel.findOne(filter);

    return !!user;
  }

  async register(user: RegisterDto): Promise<User> {
    const newUser = await this.userModel.create({
      ...user,
      status: UserStatus.active,
      roles: [Role.User],
    });

    return newUser;
  }

  async findAll(
    paginationRequestFullDto: PaginationRequestFullDto,
  ): Promise<PaginationDto<User>> {
    const filter = paginationRequestFullDto.keyword
      ? {
          email: {
            $regex: `.*${paginationRequestFullDto.keyword}.*`,
            $options: 'i',
          },
        }
      : {};

    const sortObj = {};
    sortObj[paginationRequestFullDto.sortBy] =
      paginationRequestFullDto.sortType === SortType.asc ? 1 : -1;

    const total = await this.userModel.countDocuments(filter);

    const users = await this.userModel
      .find(filter)
      .sort(sortObj)
      .skip(paginationRequestFullDto.offset)
      .limit(paginationRequestFullDto.limit);

    return {
      total,
      results: users,
    };
  }
}
