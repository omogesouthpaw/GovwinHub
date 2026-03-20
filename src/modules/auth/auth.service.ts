import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 12);
    return this.users.create({
      ...dto, password: hashed,
      firstName: dto.firstName || '',
      lastName: dto.lastName || '',
    });
  }

  async getProfile(userId: string) {
    return this.users.findById(userId);
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid email or password');
    return this.login(user);
  }

  async login(user: { id: string; mfa_enabled: boolean; email: string; role: string }) {
    if (user.mfa_enabled) {
      return {
        mfaRequired: true,
        mfaPendingToken: this.jwt.sign(
          { sub: user.id, mfaPending: true },
          { expiresIn: '5m' },
        ),
      };
    }
    return this.issueTokenPair(user);
  }

  async enrollMfa(userId: string) {
    const secret = speakeasy.generateSecret({ name: `GovConApp (${userId})`, length: 20 });
    await this.users.saveMfaSecret(userId, secret.base32);
    const qr = await qrcode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCode: qr };
  }

  async verifyMfa(userId: string, token: string) {
    const user = await this.users.findByIdWithMfaSecret(userId);
    if (!user?.mfa_secret) throw new BadRequestException('MFA not configured');
    const valid = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!valid) {
      const backupOk = await this.validateBackupCode(user, token);
      if (!backupOk) throw new UnauthorizedException('Invalid MFA token');
    }
    if (!user.mfa_enabled) await this.users.enableMfa(userId);
    return this.issueTokenPair(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.users.findById(userId);
    if (!user?.refresh_token_hash) throw new UnauthorizedException();
    const valid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!valid) throw new UnauthorizedException('Refresh token invalid or already rotated');
    return this.issueTokenPair(user);
  }

  async logout(userId: string) {
    await this.users.clearRefreshToken(userId);
  }

  private async issueTokenPair(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d', secret: this.config.get('JWT_REFRESH_SECRET') },
    );
    await this.users.saveRefreshTokenHash(user.id, await bcrypt.hash(refreshToken, 10));
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  private async validateBackupCode(user: any, token: string) {
    if (!user.mfa_backup_codes?.length) return false;
    for (let i = 0; i < user.mfa_backup_codes.length; i++) {
      if (await bcrypt.compare(token, user.mfa_backup_codes[i])) {
        await this.users.updateBackupCodes(
          user.id,
          user.mfa_backup_codes.filter((_, idx) => idx !== i),
        );
        return true;
      }
    }
    return false;
  }
}
