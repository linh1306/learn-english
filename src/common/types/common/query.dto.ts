import { PaginationDto } from './pagination.dto';

export class QueryDto extends PaginationDto {
  search?: string;
}
