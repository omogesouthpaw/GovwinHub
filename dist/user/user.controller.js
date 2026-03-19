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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const interfaces_1 = require("../interfaces");
const dto_1 = require("./dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getMe({ email }) {
        return this.userService.findByEmail(email);
    }
    async listOrgUsers(user) {
        return await this.userService.findByCompany(user.companyId);
    }
    async getUser(id, currentUser) {
        const user = await this.userService.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.companyId !== currentUser.companyId)
            throw new common_1.ForbiddenException('Access denied');
        return user;
    }
    async createUser(dto, currentUser) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        return await this.userService.create({
            ...dto,
            firstName: dto.firstName || '',
            lastName: dto.lastName || '',
        });
    }
    async updateUser(id, dto, currentUser) {
        const user = await this.userService.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.companyId !== currentUser.companyId)
            throw new common_1.ForbiddenException('Access denied');
        return await this.userService.updateUser(id, dto);
    }
    async deleteUser(id, currentUser) {
        const user = await this.userService.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.companyId !== currentUser.companyId)
            throw new common_1.ForbiddenException('Access denied');
        if (user.id === currentUser.userId)
            throw new common_1.ForbiddenException('Cannot delete yourself');
        await this.userService.softDelete(id);
        return { message: 'User deleted' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(interfaces_1.UserRole.OWNER, interfaces_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listOrgUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(interfaces_1.UserRole.OWNER, interfaces_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(interfaces_1.UserRole.OWNER, interfaces_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(interfaces_1.UserRole.OWNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UsersService])
], UserController);
//# sourceMappingURL=user.controller.js.map