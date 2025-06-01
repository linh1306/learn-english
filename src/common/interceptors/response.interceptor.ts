import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResServiceData, ResSuccess } from "../types/common/res.type";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResSuccess<T>> {
    return next.handle().pipe(
      map((serviceRes: ResServiceData<T>) => {
        const data = serviceRes.data;
        const metadata = serviceRes.metadata;
        const res: ResSuccess<T> = {
          success: true,
          data,
          metadata,
        };

        return res;
      })
    );
  }
}
