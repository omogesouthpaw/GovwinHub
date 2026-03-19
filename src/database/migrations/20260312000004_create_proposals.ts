import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('proposals', (table) => {
    addBaseColumns(table, knex);
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

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('proposals');
}
