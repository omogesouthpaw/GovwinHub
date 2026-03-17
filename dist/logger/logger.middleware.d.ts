import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { LoggerOptionsInterface } from './interfaces/logger.interface';
export declare class HttpLoggerMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly options;
    constructor(logger: LoggerService, options?: LoggerOptionsInterface);
    use(req: Request, res: Response, next: NextFunction): void;
}
