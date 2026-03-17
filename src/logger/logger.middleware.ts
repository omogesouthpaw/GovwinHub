import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { LoggerOptionsInterface } from './interfaces/logger.interface';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly options: LoggerOptionsInterface = {},
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    let requestLog = `${method} ${originalUrl} - ${ip}`;
    if (this.options.includeUserAgent) {
      requestLog += ` - ${userAgent}`;
    }
    this.logger.log(requestLog, 'HTTP Request');

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      const responseLog = `${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`;
      this.logger.log(responseLog, 'HTTP Response');
    });

    next();
  }
}
