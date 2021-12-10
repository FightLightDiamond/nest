export interface HttpExceptionResponseInterface {
  statusCode: number;
  error: string;
}

export interface CustomHttpExceptionResponseInterface
  extends HttpExceptionResponseInterface {
  path: string;
  method: string;
  timeStamp: Date;
}
