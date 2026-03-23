"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
exports.toSnakeCase = toSnakeCase;
exports.toCamelCase = toCamelCase;
exports.mapToSnakeCase = mapToSnakeCase;
exports.mapToCamelCase = mapToCamelCase;
const uuid_1 = require("uuid");
function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
function toCamelCase(str) {
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
function mapToSnakeCase(data) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
        const snakeKey = toSnakeCase(key);
        if (JSON_COLUMNS.has(snakeKey) && (Array.isArray(value) || (typeof value === 'object' && value !== null))) {
            result[snakeKey] = JSON.stringify(value);
        }
        else {
            result[snakeKey] = value;
        }
    }
    return result;
}
function mapToCamelCase(row) {
    const result = {};
    for (const [key, value] of Object.entries(row)) {
        const camelKey = toCamelCase(key);
        if (JSON_COLUMNS.has(key) && typeof value === 'string') {
            try {
                result[camelKey] = JSON.parse(value);
            }
            catch {
                result[camelKey] = value;
            }
        }
        else {
            result[camelKey] = value;
        }
    }
    return result;
}
class BaseRepository {
    knex;
    constructor(knex) {
        this.knex = knex;
    }
    activeQuery() {
        return this.knex(this.tableName).whereNull('deleted_at');
    }
    async findById(id) {
        const row = await this.activeQuery().where('id', id).first();
        return row ? mapToCamelCase(row) : null;
    }
    async findAll() {
        const rows = await this.activeQuery().select('*');
        return rows.map((row) => mapToCamelCase(row));
    }
    async create(data) {
        const now = new Date();
        console.log('Creating record in', this.tableName, 'with data:', data);
        const record = mapToSnakeCase({
            id: (0, uuid_1.v4)(),
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        await this.knex(this.tableName).insert(record);
        return await this.findById(record.id);
    }
    async update(id, data) {
        const record = mapToSnakeCase({
            ...data,
            updatedAt: new Date(),
        });
        delete record.id;
        await this.activeQuery().where('id', id).update(record);
        return await this.findById(id);
    }
    async softDelete(id) {
        await this.activeQuery().where('id', id).update({ deleted_at: new Date() });
    }
    async hardDelete(id) {
        await this.knex(this.tableName).where('id', id).delete();
    }
    async count() {
        const result = await this.activeQuery().count('* as count').first();
        return Number(result?.count ?? 0);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map