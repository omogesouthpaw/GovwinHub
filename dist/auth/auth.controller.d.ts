import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from '../user/dto/create-user.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<any>;
    login(dto: LoginDto): Promise<{
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
    enrollMfa(user: any): Promise<{
        secret: any;
        qrCode: any;
    }>;
    verifyMfa(user: any, dto: VerifyMfaDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    refresh(body: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    logout(user: any): Promise<void>;
    me(user: any): Promise<any>;
}
