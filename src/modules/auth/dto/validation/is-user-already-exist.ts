import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: false })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(text: string, validationArguments: ValidationArguments) {
    // @ts-ignore
    const { _id } = validationArguments.object;

    const result = await this.usersService.checkExist(text, _id);
    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This email already exists!';
  }
}
