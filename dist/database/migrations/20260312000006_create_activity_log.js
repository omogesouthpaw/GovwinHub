"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("../helpers");
async function up(knex) {
    await knex.schema.createTable('activity_log', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('org_id', 36).notNullable();
        table.string('user_id', 36).notNullable();
        table.string('entity_type', 50).notNullable();
        table.string('entity_id', 36).notNullable();
        table.string('action', 50).notNullable();
        table.json('metadata').nullable();
        table.foreign('org_id').references('id').inTable('Companys');
        table.foreign('user_id').references('id').inTable('users');
        table.index(['entity_type', 'entity_id']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('activity_log');
}
//# sourceMappingURL=20260312000006_create_activity_log.js.map