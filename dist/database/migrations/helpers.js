"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBaseColumns = addBaseColumns;
function addBaseColumns(table, knex) {
    table.string('id', 36).primary();
    table.datetime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.datetime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.datetime('deleted_at').nullable().defaultTo(null);
    table.datetime('expired_at').nullable().defaultTo(null);
}
//# sourceMappingURL=helpers.js.map