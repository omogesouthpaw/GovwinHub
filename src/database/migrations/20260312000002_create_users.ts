import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    addBaseColumns(table, knex);
    table.string('org_id', 36).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('cognito_sub', 255).notNullable().unique();
    table.enum('role', ['owner', 'admin', 'editor', 'viewer']).notNullable().defaultTo('editor');
    table.string('full_name', 255).nullable();
    table.foreign('org_id').references('id').inTable('Companys');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
