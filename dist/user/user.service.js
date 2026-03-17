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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const knex_module_1 = require("../database/knex.module");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    async findById(id) {
        return this.knex('users')
            .where({ id, is_active: true })
            .first();
    }
    async findByEmail(email) {
        return this.knex('users').where({ email }).first();
    }
    async findByEmailWithPassword(email) {
        return this.knex('users')
            .select('*')
            .where({ email, is_active: true })
            .first();
    }
    async findByIdWithMfaSecret(id) {
        return this.knex('users')
            .select(['id', 'mfa_enabled', 'mfa_secret', 'mfa_backup_codes'])
            .where({ id })
            .first();
    }
    async create(data) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        const [user] = await this.knex('users').insert({
            email: data.email,
            password: passwordHash,
            first_name: data.firstName,
            last_name: data.lastName,
            company_id: data.companyId,
        }).returning(['id', 'email', 'first_name', 'last_name', 'role', 'created_at']);
        return user;
    }
    async updateUser(id, data) {
        const updateData = {};
        if (data.email)
            updateData.email = data.email;
        if (data.password)
            updateData.password = await bcrypt.hash(data.password, 10);
        if (data.firstName)
            updateData.first_name = data.firstName;
        if (data.lastName)
            updateData.last_name = data.lastName;
        if (data.role)
            updateData.role = data.role;
        await this.knex('users').where({ id }).update(updateData);
        return this.findById(id);
    }
    async softDelete(id) {
        await this.knex('users').where({ id }).update({ is_active: false });
    }
    async findByOrganization(orgId) {
        return this.knex('users')
            .where({ org_id: orgId, is_active: true })
            .select('id', 'email', 'first_name', 'last_name', 'role', 'created_at');
    }
    async saveMfaSecret(id, secret) {
        await this.knex('users').where({ id }).update({
            mfa_secret: secret,
            mfa_enabled: false,
        });
    }
    async enableMfa(id) {
        await this.knex('users').where({ id }).update({ mfa_enabled: true });
    }
    async saveRefreshTokenHash(id, hash) {
        await this.knex('users').where({ id }).update({ refresh_token_hash: hash });
    }
    async updateBackupCodes(id, codes) {
        await this.knex('users').where({ id }).update({ mfa_backup_codes: codes });
    }
    async clearRefreshToken(id) {
        await this.knex('users').where({ id }).update({ refresh_token_hash: null });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(knex_module_1.KNEX_CONNECTION)),
    __metadata("design:paramtypes", [Function])
], UsersService);
//# sourceMappingURL=user.service.js.map