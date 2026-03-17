import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerOptionsInterface } from 'src/logger/interfaces/logger.interface';
import { LoggerService } from 'src/logger/logger.service';
export declare class HttpLoggerMiddleware implements NestMiddleware {
    private readonly logger;
    private readonly options;
    constructor(logger: LoggerService, options?: LoggerOptionsInterface);
    use(req: Request, res: Response, next: NextFunction): void;
    private captureResponse;
}
