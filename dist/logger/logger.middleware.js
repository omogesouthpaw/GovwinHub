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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
let HttpLoggerMiddleware = class HttpLoggerMiddleware {
    logger;
    options;
    constructor(logger, options = {}) {
        this.logger = logger;
        this.options = options;
    }
    use(req, res, next) {
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
};
exports.HttpLoggerMiddleware = HttpLoggerMiddleware;
exports.HttpLoggerMiddleware = HttpLoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object])
], HttpLoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map