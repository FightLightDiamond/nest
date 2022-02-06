import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // return res.redirect('/api')
    console.log('Request...', req.baseURI);
    next();
  }
}
