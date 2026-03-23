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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const company_service_1 = require("./company.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const interfaces_1 = require("../interfaces");
const company_dto_1 = require("./dto/company.dto");
let CompanyController = class CompanyController {
    companyService;
    constructor(companyService) {
        this.companyService = companyService;
    }
    async getMyCompany(user) {
        const org = await this.companyService.findById(user.companyId);
        if (!org)
            throw new common_1.NotFoundException('Company not found');
        return org;
    }
    async createCompany(dto, user) {
        return this.companyService.createCompany(dto);
    }
    async updateMyCompany(dto, user) {
        const org = await this.companyService.findById(user.companyId);
        if (!org)
            throw new common_1.NotFoundException('Company not found');
        return this.companyService.updateCompany(user.companyId, dto);
    }
    async getCompany(id, user) {
        const org = await this.companyService.findById(id);
        if (!org)
            throw new common_1.NotFoundException('Company not found');
        if (org.id !== user.companyId)
            throw new common_1.ForbiddenException('Access denied');
        return org;
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getMyCompany", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.CreateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "createCompany", null);
__decorate([
    (0, common_1.Patch)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(interfaces_1.UserRole.OWNER, interfaces_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "updateMyCompany", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheKey)('company'),
    (0, cache_manager_1.CacheTTL)(30_000),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getCompany", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map