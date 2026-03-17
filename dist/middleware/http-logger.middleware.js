"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
let HttpLoggerMiddleware = class HttpLoggerMiddleware {
    logger;
    options;
    constructor(logger, options = {}) {
        this.logger = logger;
        this.options = options;
    }
    use(req, res, next) {
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
    captureResponse(req, res, startTime) {
        res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            const { method, originalUrl } = req;
            const { statusCode } = res;
            const responseLog = ` ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`;
            if (statusCode >= 500) {
                this.logger.error(responseLog, 'HTTP Response');
            }
            else if (statusCode >= 400) {
                this.logger.warn(responseLog, 'HTTP Response');
            }
            else {
                this.logger.log(responseLog, 'HTTP Response');
            }
        });
        res.on('error', (error) => {
            const responseTime = Date.now() - startTime;
            const { method, originalUrl } = req;
            this.logger.error(`${method} ${originalUrl} - Error - ${responseTime}ms - ${error.message}`, error.stack, 'HTTP Error');
        });
    }
};
exports.HttpLoggerMiddleware = HttpLoggerMiddleware;
exports.HttpLoggerMiddleware = HttpLoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)('LOGGER_OPTIONS')),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object])
], HttpLoggerMiddleware);
//# sourceMappingURL=http-logger.middleware.js.map