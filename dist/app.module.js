"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http_logger_middleware_1 = require("./middleware/http-logger.middleware");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const app_config_1 = require("./config/app.config");
const environment_validation_1 = require("./config/environment.validation");
const database_1 = require("./database");
const logger_module_1 = require("./logger/logger.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const company_module_1 = require("./modules/company/company.module");
const opportunities_module_1 = require("./modules/opportunities/opportunities.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
                validationSchema: environment_validation_1.default,
            }),
            database_1.KnexModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    host: configService.get('config.dbHost', 'localhost'),
                    port: configService.get('config.dbPort', 3306),
                    user: configService.get('config.dbUser', 'root'),
                    password: configService.get('config.dbPassword', ''),
                    database: configService.get('config.dbName', 'govwinhub'),
                }),
            }),
            logger_module_1.LoggerModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            company_module_1.CompanyModule,
            opportunities_module_1.OpportunitiesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map