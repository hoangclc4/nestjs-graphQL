import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlArgumentsHost, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const req = context.switchToHttp().getRequest();
    const date = Date.now();

    if (req) {
      const method = req.method;
      const url = req.url;
      return next.handle().pipe(
        tap(() => {
          console.log(`After...`);
          Logger.log(
            `${method} ${url} ${Date.now() - date}ms `,
            context.getClass.name,
          );
        }),
      );
    } else {
      const ctx = GqlExecutionContext.create(context);
      const info = ctx.getInfo();

      return next.handle().pipe(
        tap(() => {
          console.log(`After...`);
          Logger.log(
            `${info.parentType} ${info.fieldName} ${Date.now() - date}ms `,
            'Resolver',
          );
        }),
      );
    }
  }
}
