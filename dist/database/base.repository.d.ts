import { Knex } from 'knex';
import { BaseEntity } from '../common/interfaces';
export declare function toSnakeCase(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function mapToSnakeCase(data: Record<string, any>): Record<string, any>;
export declare function mapToCamelCase(row: Record<string, any>): Record<string, any>;
export declare abstract class BaseRepository<T extends BaseEntity> {
    protected readonly knex: Knex;
    protected abstract readonly tableName: string;
    constructor(knex: Knex);
    protected activeQuery(): Knex.QueryBuilder;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Omit<Partial<T>, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    softDelete(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    count(): Promise<number>;
}
