import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CustomHttpExceptionResponseInterface,
  HttpExceptionResponseInterface,
} from './http-exception-response.interface';
import * as fs from 'fs';

@Catch()
/**
 * All Exceptions Filter
 */
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    debugger;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponseInterface).error ||
        exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critial internal server error occurred';
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);
    const errorLog: string = this.getLogError(
      errorResponse,
      request,
      exception,
    );

    this.writeErrorLogToFile(errorLog);

    response.status(status).json(errorResponse);
  }

  /**
   * Get Error Response
   * @param status
   * @param errorMessage
   * @param request
   */
  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponseInterface => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  /**
   * Log Error
   * @param errorResponse
   * @param request
   * @param exception
   */
  private getLogError = (
    errorResponse: CustomHttpExceptionResponseInterface,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error, timeStamp } = errorResponse;
    const { url, method, user } = request;
    return `${timeStamp}: Response Code: ${statusCode} - Method: ${method} - URL: ${url} - ${error} - ${JSON.stringify(
      user ?? 'Not signed in',
    )}\n\n ${
      exception instanceof HttpException ? exception?.stack : error
    }\n\n`;
  };

  /**
   * Write Error Log To File
   * @param errorLog
   */
  private writeErrorLogToFile = (errorLog: string) => {
    fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
      if (err) throw err;
    });
  };
}
