import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/user/user.service';
export declare class AuthService {
    private users;
    private jwt;
    private config;
    constructor(users: UsersService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<any>;
    validateCredentials(email: string, pass: string): Promise<any>;
    login(user: {
        id: string;
        mfa_enabled: boolean;
        email: string;
        role: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    } | {
        mfaRequired: boolean;
        mfaPendingToken: string;
    }>;
    enrollMfa(userId: string): Promise<{
        secret: any;
        qrCode: any;
    }>;
    verifyMfa(userId: string, token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    logout(userId: string): Promise<void>;
    private issueTokenPair;
    private validateBackupCode;
}
