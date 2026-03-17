"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("./helpers");
async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('org_id', 36).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('cognito_sub', 255).notNullable().unique();
        table.enum('role', ['owner', 'admin', 'editor', 'viewer']).notNullable().defaultTo('editor');
        table.string('full_name', 255).nullable();
        table.foreign('org_id').references('id').inTable('organizations');
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('users');
}
//# sourceMappingURL=20260312000002_create_users.js.map