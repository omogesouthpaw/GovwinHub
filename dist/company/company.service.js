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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_1 = require("../database");
const base_repository_1 = require("../database/base.repository");
let CompanyService = class CompanyService extends base_repository_1.BaseRepository {
    tableName = 'organizations';
    constructor(knex) {
        super(knex);
    }
    async findByName(name) {
        const row = await this.activeQuery().where('name', name).first();
        return row ? (0, base_repository_1.mapToCamelCase)(row) : null;
    }
    async findByNaicsCode(code) {
        const rows = await this.activeQuery()
            .whereRaw('JSON_CONTAINS(naics_codes, ?)', [JSON.stringify(code)]);
        return rows.map((row) => (0, base_repository_1.mapToCamelCase)(row));
    }
    async createOrganization(data) {
        return this.create(data);
    }
    async updateOrganization(id, data) {
        return this.update(id, data);
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], CompanyService);
//# sourceMappingURL=company.service.js.map