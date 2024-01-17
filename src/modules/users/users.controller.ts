import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.schema';
import {
  PaginationDto,
  PaginationResponse,
} from '../../dtos/pagination-response.dto';
import { PaginationRequestFullDto } from '../../dtos/pagination-request.dto';
import { AuthApiError } from '../../decorators/api-error-response.decorator';

@ApiExtraModels(PaginationDto)
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PaginationResponse(User)
  @ApiOperation({ summary: 'User list with filter' })
  @AuthApiError()
  @Get()
  async findAll(
    @Query() queries: PaginationRequestFullDto,
  ): Promise<PaginationDto<User>> {
    const data = await this.usersService.findAll(queries);

    return data;
  }

  @ApiOkResponse({ type: User })
  @AuthApiError()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const data = await this.usersService.findById(id);

    return data;
  }
}
