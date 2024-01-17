import { IsNotEmpty, IsEmail, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExist } from './validation/is-user-already-exist';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
