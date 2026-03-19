import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  // Add created_by user to proposals
  await knex.schema.alterTable('proposals', (table) => {
    table.string('user_id', 36).nullable();
    table.foreign('user_id').references('id').inTable('users');
  });

  // Join table: users save/track opportunities for their company
  await knex.schema.createTable('saved_opportunities', (table) => {
    addBaseColumns(table, knex);
    table.string('user_id', 36).notNullable();
    table.string('company_id', 36).notNullable();
    table.string('opportunity_id', 36).notNullable();
    table.string('notes', 500).nullable();
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('company_id').references('id').inTable('organizations');
    table.foreign('opportunity_id').references('id').inTable('opportunities');
    table.unique(['user_id', 'opportunity_id']);
    table.index(['company_id', 'opportunity_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('saved_opportunities');
  await knex.schema.alterTable('proposals', (table) => {
    table.dropForeign(['user_id']);
    table.dropColumn('user_id');
  });
}
