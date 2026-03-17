"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('users', (table) => {
        table.string('password_hash', 255).notNullable().defaultTo('');
    });
}
async function down(knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('password_hash');
    });
}
//# sourceMappingURL=20260312000007_add_password_hash_to_users.js.map