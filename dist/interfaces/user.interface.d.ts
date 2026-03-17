import { BaseEntity } from './base.interface';
export declare enum UserRole {
    OWNER = "owner",
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer"
}
export interface IUser extends BaseEntity {
    companyId: string;
    userId: string;
    email: string;
    role: UserRole;
}
export type CreateUserDto = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateUserDto = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt' | 'passwordHash'>>;
export type SafeUser = Omit<IUser, 'passwordHash'>;
