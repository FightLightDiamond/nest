import {ArgumentsHost, ExceptionFilter, HttpException, HttpServer, HttpStatus} from "@nestjs/common";
import {isObject} from "@nestjs/common/utils/shared.utils";
import {AbstractHttpAdapter} from "@nestjs/core";
import {MESSAGES} from "@nestjs/core/constants";

export class BaseExceptionFilter<T = any> implements ExceptionFilter<T> {
  // ...
  catch(exception: T, host: ArgumentsHost) {
    // ...
    // if (!(exception instanceof HttpException)) {
    //   return this.handleUnknownError(exception, host, applicationRef);
    // }
    // const res = exception.getResponse();
    // const message = isObject(res)
    //   ? res
    //   : {
    //     statusCode: exception.getStatus(),
    //     message: res,
    //   };
    // ...
  }

  public handleUnknownError(
    exception: T,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const body = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
    };
    // ...
  }
}
