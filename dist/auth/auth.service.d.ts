import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private users;
    private jwt;
    private config;
    constructor(users: UsersService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<any>;
    getProfile(userId: string): Promise<any>;
    loginWithCredentials(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    } | {
        mfaRequired: boolean;
        mfaPendingToken: string;
    }>;
    login(user: {
        id: string;
        mfa_enabled: boolean;
        email: string;
        role: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
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
            id: any;
            email: any;
            role: any;
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    logout(userId: string): Promise<void>;
    private issueTokenPair;
    private validateBackupCode;
}
