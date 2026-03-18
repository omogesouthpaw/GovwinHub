"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("../helpers");
async function up(knex) {
    await knex.schema.createTable('proposal_sections', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('proposal_id', 36).notNullable();
        table.string('section_type', 50).notNullable();
        table.string('title', 255).nullable();
        table.text('content').nullable();
        table.integer('sort_order').notNullable().defaultTo(0);
        table.boolean('ai_generated').notNullable().defaultTo(false);
        table.foreign('proposal_id').references('id').inTable('proposals').onDelete('CASCADE');
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('proposal_sections');
}
//# sourceMappingURL=20260312000005_create_proposal_sections.js.map