import { Knex } from 'knex';
export declare class UsersService {
    private knex;
    constructor(knex: Knex);
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findByEmailWithPassword(email: string): Promise<any>;
    findByIdWithMfaSecret(id: string): Promise<any>;
    create(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        orgId?: string;
    }): Promise<any>;
    updateUser(id: string, data: {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }): Promise<any>;
    softDelete(id: string): Promise<void>;
    findByCompany(orgId: string): Promise<any[]>;
    saveMfaSecret(id: string, secret: string): Promise<void>;
    enableMfa(id: string): Promise<void>;
    saveRefreshTokenHash(id: string, hash: string): Promise<void>;
    updateBackupCodes(id: string, codes: string[]): Promise<void>;
    clearRefreshToken(id: string): Promise<void>;
}
