import { Knex } from 'knex';

export function addBaseColumns(table: Knex.CreateTableBuilder, knex: Knex) {
  table.string('id', 36).primary();
  table.datetime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  table.datetime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  table.datetime('deleted_at').nullable().defaultTo(null);
  table.datetime('expired_at').nullable().defaultTo(null);
}
