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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    users;
    jwt;
    config;
    constructor(users, jwt, config) {
        this.users = users;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const exists = await this.users.findByEmail(dto.email);
        if (exists)
            throw new common_1.ConflictException('Email already registered');
        const hashed = await bcrypt.hash(dto.password, 12);
        return this.users.create({
            ...dto, password: hashed,
            firstName: dto.firstName || '',
            lastName: dto.lastName || '',
        });
    }
    async validateCredentials(email, pass) {
        const user = await this.users.findByEmailWithPassword(email);
        if (!user)
            return null;
        const ok = await bcrypt.compare(pass, user.password);
        return ok ? user : null;
    }
    async login(user) {
        if (user.mfa_enabled) {
            return {
                mfaRequired: true,
                mfaPendingToken: this.jwt.sign({ sub: user.id, mfaPending: true }, { expiresIn: '5m' }),
            };
        }
        return this.issueTokenPair(user);
    }
    async enrollMfa(userId) {
        const secret = speakeasy.generateSecret({ name: `GovConApp (${userId})`, length: 20 });
        await this.users.saveMfaSecret(userId, secret.base32);
        const qr = await qrcode.toDataURL(secret.otpauth_url);
        return { secret: secret.base32, qrCode: qr };
    }
    async verifyMfa(userId, token) {
        const user = await this.users.findByIdWithMfaSecret(userId);
        if (!user?.mfa_secret)
            throw new common_1.BadRequestException('MFA not configured');
        const valid = speakeasy.totp.verify({
            secret: user.mfa_secret,
            encoding: 'base32',
            token,
            window: 1,
        });
        if (!valid) {
            const backupOk = await this.validateBackupCode(user, token);
            if (!backupOk)
                throw new common_1.UnauthorizedException('Invalid MFA token');
        }
        if (!user.mfa_enabled)
            await this.users.enableMfa(userId);
        return this.issueTokenPair(user);
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.users.findById(userId);
        if (!user?.refresh_token_hash)
            throw new common_1.UnauthorizedException();
        const valid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
        if (!valid)
            throw new common_1.UnauthorizedException('Refresh token invalid or already rotated');
        return this.issueTokenPair(user);
    }
    async logout(userId) {
        await this.users.clearRefreshToken(userId);
    }
    async issueTokenPair(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d', secret: this.config.get('JWT_REFRESH_SECRET') });
        await this.users.saveRefreshTokenHash(user.id, await bcrypt.hash(refreshToken, 10));
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async validateBackupCode(user, token) {
        if (!user.mfa_backup_codes?.length)
            return false;
        for (let i = 0; i < user.mfa_backup_codes.length; i++) {
            if (await bcrypt.compare(token, user.mfa_backup_codes[i])) {
                await this.users.updateBackupCodes(user.id, user.mfa_backup_codes.filter((_, idx) => idx !== i));
                return true;
            }
        }
        return false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map