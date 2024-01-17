import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SortType } from '../enums/sort.enum';

export class PaginationBaseRequestDto {
  @ApiProperty({
    required: false,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset = 0;

  @ApiProperty({
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit = 10;
}

export class PaginationRequestWithKeywordDto extends PaginationBaseRequestDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  keyword: string;
}

export class PaginationRequestWithSortDto extends PaginationBaseRequestDto {
  @ApiProperty({
    required: false,
    enum: SortType,
    default: SortType.asc,
  })
  @IsOptional()
  @Type(() => String)
  sortType: SortType;

  @ApiProperty({
    required: false,
    default: '_id',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  sortBy = '_id';
}

export class PaginationRequestFullDto extends IntersectionType(
  PaginationRequestWithKeywordDto,
  PaginationRequestWithSortDto,
) {}
