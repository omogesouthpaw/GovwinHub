import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../interfaces';

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

const JSON_COLUMNS = new Set([
  'naics_codes',
  'psc_codes',
  'raw_data',
  'embedding',
  'extracted_requirements',
  'evaluation_criteria',
  'metadata',
]);

export function mapToSnakeCase(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = toSnakeCase(key);
    if (JSON_COLUMNS.has(snakeKey) && (Array.isArray(value) || (typeof value === 'object' && value !== null))) {
      result[snakeKey] = JSON.stringify(value);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}

export function mapToCamelCase(row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = toCamelCase(key);
    if (JSON_COLUMNS.has(key) && typeof value === 'string') {
      try {
        result[camelKey] = JSON.parse(value);
      } catch {
        result[camelKey] = value;
      }
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract readonly tableName: string;

  constructor(protected readonly knex: Knex) {}

  protected activeQuery(): Knex.QueryBuilder {
    return this.knex(this.tableName).whereNull('deleted_at');
  }

  async findById(id: string): Promise<T | null> {
    const row = await this.activeQuery().where('id', id).first();
    return row ? mapToCamelCase(row) as T : null;
  }

  async findAll(): Promise<T[]> {
    const rows = await this.activeQuery().select('*');
    return rows.map((row) => mapToCamelCase(row) as T);
  }

  async create(data: Omit<Partial<T>, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<T> {
    const now = new Date();
    const record = mapToSnakeCase({
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    await this.knex(this.tableName).insert(record);
    return this.findById(record.id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const record = mapToSnakeCase({
      ...data,
      updatedAt: new Date(),
    });
    delete record.id;
    await this.activeQuery().where('id', id).update(record);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.activeQuery().where('id', id).update({ deleted_at: new Date() });
  }

  async hardDelete(id: string): Promise<void> {
    await this.knex(this.tableName).where('id', id).delete();
  }

  async count(): Promise<number> {
    const result = await this.activeQuery().count('* as count').first();
    return Number(result?.count ?? 0);
  }
}
