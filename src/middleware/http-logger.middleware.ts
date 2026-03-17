import { Inject, Injectable, NestMiddleware, Optional } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerOptionsInterface } from '../logger/interfaces/logger.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    @Optional() @Inject('LOGGER_OPTIONS') private readonly options: LoggerOptionsInterface = {},
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const options = this.options || {};
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    let requestLog = `${method} - ${originalUrl} - ${ip}`;
    if (options.includeUserAgent) {
      requestLog += ` - ${userAgent}`;
    }
    this.logger.log(requestLog, 'HTTP Request');

    this.captureResponse(req, res, startTime);
    next();
  }

  private captureResponse(req: Request, res: Response, startTime: number): void {
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const responseLog = ` ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`;
      if (statusCode >= 500) {
        this.logger.error(responseLog, 'HTTP Response');
      } else if (statusCode >= 400) {
        this.logger.warn(responseLog, 'HTTP Response');
      } else {
        this.logger.log(responseLog, 'HTTP Response');
      }
    });

    res.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      const { method, originalUrl } = req;
      this.logger.error(
        `${method} ${originalUrl} - Error - ${responseTime}ms - ${error.message}`,
        error.stack,
        'HTTP Error',
      );
    });
  }
}
