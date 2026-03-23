import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('proposals', (table) => {
    addBaseColumns(table, knex);
    table.uuid('org_id').notNullable();
    table.uuid('opportunity_id').nullable();
    table.string('title', 255).nullable();
    table.string('status', 20).notNullable().defaultTo('draft');
    table.string('rfp_file_key', 500).nullable();
    table.jsonb('extracted_requirements').nullable();
    table.jsonb('evaluation_criteria').nullable();
    table.foreign('org_id').references('id').inTable('organizations');
    table.foreign('opportunity_id').references('id').inTable('opportunities');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('proposals');
}
