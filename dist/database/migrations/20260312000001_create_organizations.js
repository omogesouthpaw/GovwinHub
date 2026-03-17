"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("./helpers");
async function up(knex) {
    await knex.schema.createTable('organizations', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('name', 255).notNullable();
        table.json('naics_codes').notNullable().defaultTo('[]');
        table.string('cage_code', 10).nullable();
        table.string('uei', 20).nullable();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('organizations');
}
//# sourceMappingURL=20260312000001_create_organizations.js.map