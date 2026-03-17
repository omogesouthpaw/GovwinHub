import { UserRole } from '../../interfaces';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyId?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class VerifyMfaDto {
    token: string;
}
