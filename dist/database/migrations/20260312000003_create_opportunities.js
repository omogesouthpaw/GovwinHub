"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const helpers_1 = require("./helpers");
async function up(knex) {
    await knex.schema.createTable('opportunities', (table) => {
        (0, helpers_1.addBaseColumns)(table, knex);
        table.string('source', 50).notNullable();
        table.string('source_id', 255).notNullable();
        table.text('title').notNullable();
        table.text('description').nullable();
        table.string('agency', 255).nullable();
        table.json('naics_codes').notNullable().defaultTo('[]');
        table.json('psc_codes').notNullable().defaultTo('[]');
        table.string('set_aside', 100).nullable();
        table.string('contract_type', 50).nullable();
        table.string('place_of_performance', 255).nullable();
        table.datetime('posted_date').nullable();
        table.datetime('response_date').nullable();
        table.decimal('award_amount', 15, 2).nullable();
        table.text('url').nullable();
        table.json('raw_data').nullable();
        table.json('embedding').nullable();
        table.unique(['source', 'source_id']);
        table.index(['agency']);
        table.index(['response_date']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('opportunities');
}
//# sourceMappingURL=20260312000003_create_opportunities.js.map