import { Catch, ArgumentsHost, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(applicationRef: HttpServer) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const params = request.body;
    if (typeof params.password !== 'undefined') {
      params.password = '*******';
    }
    if (typeof params.old_password !== 'undefined') {
      params.old_password = '*******';
    }
    if (typeof params.new_password !== 'undefined') {
      params.new_password = '*******';
    }
  }
}
