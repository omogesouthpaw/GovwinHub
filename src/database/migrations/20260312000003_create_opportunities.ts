import { Knex } from 'knex';
import { addBaseColumns } from './helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('opportunities', (table) => {
    addBaseColumns(table, knex);
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

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('opportunities');
}
