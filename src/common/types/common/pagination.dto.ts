import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  pageSize: number = 10;

  @ApiProperty({
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  total?: number = 0;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export function paginateResponse<T>(
  data: T[],
  total: number,
  { page, pageSize }: PaginationDto,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}
