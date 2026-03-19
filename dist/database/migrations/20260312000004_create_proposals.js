"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("../helpers");
async function up(knex) {
    await knex.schema.createTable('proposals', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('org_id', 36).notNullable();
        table.string('opportunity_id', 36).nullable();
        table.string('title', 255).nullable();
        table.string('status', 20).notNullable().defaultTo('draft');
        table.string('rfp_file_key', 500).nullable();
        table.json('extracted_requirements').nullable();
        table.json('evaluation_criteria').nullable();
        table.foreign('org_id').references('id').inTable('Companys');
        table.foreign('opportunity_id').references('id').inTable('opportunities');
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('proposals');
}
//# sourceMappingURL=20260312000004_create_proposals.js.map