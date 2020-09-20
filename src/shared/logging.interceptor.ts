import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const date = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`After...`);
        Logger.log(
          `${method} ${url} ${Date.now() - date}ms `,
          context.getClass.name,
        );
      }),
    );
  }
}
