import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyMfaDto } from 'src/user/dto/create-user.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<any>;
    login(req: any): Promise<{
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
    enrollMfa(user: any): Promise<{
        secret: any;
        qrCode: any;
    }>;
    verifyMfa(user: any, dto: VerifyMfaDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    refresh(body: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    logout(user: any): Promise<void>;
    me(user: any): any;
}
