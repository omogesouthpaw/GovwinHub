import { Knex } from 'knex';
import { addBaseColumns } from './helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations', (table) => {
    addBaseColumns(table, knex);
    table.string('name', 255).notNullable();
    table.json('naics_codes').notNullable().defaultTo('[]');
    table.string('cage_code', 10).nullable();
    table.string('uei', 20).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('organizations');
}
