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
exports.OpportunitiesService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const database_1 = require("../database");
const base_repository_1 = require("../database/base.repository");
let OpportunitiesService = class OpportunitiesService extends base_repository_1.BaseRepository {
    tableName = 'opportunities';
    constructor(knex) {
        super(knex);
    }
    async findBySourceAndSourceId(source, sourceId) {
        const row = await this.activeQuery()
            .where('source', source)
            .where('source_id', sourceId)
            .first();
        return row ? (0, base_repository_1.mapToCamelCase)(row) : null;
    }
    async findByAgency(agency) {
        const rows = await this.activeQuery().where('agency', agency);
        return rows.map((row) => (0, base_repository_1.mapToCamelCase)(row));
    }
    async findUpcoming(limit = 50) {
        const rows = await this.activeQuery()
            .where('response_date', '>=', new Date())
            .orderBy('response_date', 'asc')
            .limit(limit);
        return rows.map((row) => (0, base_repository_1.mapToCamelCase)(row));
    }
    async upsert(data) {
        const existing = await this.findBySourceAndSourceId(data.source, data.sourceId);
        if (existing) {
            return this.update(existing.id, data);
        }
        return this.create(data);
    }
    async findByNaicsCode(code) {
        const rows = await this.activeQuery()
            .whereRaw('JSON_CONTAINS(naics_codes, ?)', [JSON.stringify(code)]);
        return rows.map((row) => (0, base_repository_1.mapToCamelCase)(row));
    }
};
exports.OpportunitiesService = OpportunitiesService;
exports.OpportunitiesService = OpportunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], OpportunitiesService);
//# sourceMappingURL=opportunities.service.js.map