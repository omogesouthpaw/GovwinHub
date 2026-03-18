import { BaseEntity } from './base.interface';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface IUser extends BaseEntity {
  userId: string;
  companyId: string | null;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaBackupCodes: string[] | null;
  refreshTokenHash: string | null;
}

export type CreateUserDto = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateUserDto = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt' | 'passwordHash'>>;
export type SafeUser = Omit<IUser, 'passwordHash'>;
