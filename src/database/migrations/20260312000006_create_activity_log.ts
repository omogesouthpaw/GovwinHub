import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('activity_log', (table) => {
    addBaseColumns(table, knex);
    table.uuid('org_id').notNullable();
    table.uuid('user_id').notNullable();
    table.string('entity_type', 50).notNullable();
    table.uuid('entity_id').notNullable();
    table.string('action', 50).notNullable();
    table.jsonb('metadata').nullable();
    table.foreign('org_id').references('id').inTable('organizations');
    table.foreign('user_id').references('id').inTable('users');
    table.index(['entity_type', 'entity_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('activity_log');
}
