import { PaginationDto } from './pagination.dto';

export interface IErr {
  code: string;
  message: string;
  field?: string[];
}

export interface IRes<T, P = PaginationDto> {
  success: boolean;
  data: T;
  error?: IErr;
  mes_errors?: string[];
  metadata?: P;
}

export type ResService<T = any, P = PaginationDto> = Promise<
  Pick<IRes<T, P>, 'data' | 'metadata'>
>;

export type ResServiceData<T> = Pick<IRes<T>, 'data' | 'metadata'>;

export type ResSuccess<T> = Pick<IRes<T>, 'success' | 'data' | 'metadata'>;

export type ResError = Pick<IRes<null>, 'success' | 'error' | 'mes_errors'>;
