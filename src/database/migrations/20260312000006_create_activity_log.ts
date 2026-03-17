import { Knex } from 'knex';
import { addBaseColumns } from './helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('activity_log', (table) => {
    addBaseColumns(table, knex);
    table.string('org_id', 36).notNullable();
    table.string('user_id', 36).notNullable();
    table.string('entity_type', 50).notNullable();
    table.string('entity_id', 36).notNullable();
    table.string('action', 50).notNullable();
    table.json('metadata').nullable();
    table.foreign('org_id').references('id').inTable('organizations');
    table.foreign('user_id').references('id').inTable('users');
    table.index(['entity_type', 'entity_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('activity_log');
}
