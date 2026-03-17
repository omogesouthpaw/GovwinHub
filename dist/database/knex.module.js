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
var KnexModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexModule = exports.KNEX_CONNECTION = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const datasource_1 = require("./datasource");
exports.KNEX_CONNECTION = 'KNEX_CONNECTION';
let KnexModule = KnexModule_1 = class KnexModule {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    static forRootAsync(options) {
        const knexProvider = {
            provide: exports.KNEX_CONNECTION,
            useFactory: async (...args) => {
                const connectionOptions = await options.useFactory(...args);
                return (0, datasource_1.createKnexInstance)(connectionOptions);
            },
            inject: options.inject || [],
        };
        return {
            module: KnexModule_1,
            providers: [knexProvider],
            exports: [exports.KNEX_CONNECTION],
        };
    }
    async onApplicationShutdown() {
        if (this.knex) {
            await this.knex.destroy();
        }
    }
};
exports.KnexModule = KnexModule;
exports.KnexModule = KnexModule = KnexModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({}),
    __param(0, (0, common_1.Inject)(exports.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], KnexModule);
//# sourceMappingURL=knex.module.js.map