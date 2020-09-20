import { UserModule } from './user/user.module';
import { IdeaModule } from './idea/idea.module';
import { Module } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { HttpErrorFilter } from './shared/http-error.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { ValidationPipe } from './shared/validation.pipe';
@Module({
  imports: [
    UserModule,
    IdeaModule,
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
