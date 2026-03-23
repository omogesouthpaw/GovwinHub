import { Knex } from 'knex';

export function addBaseColumns(table: Knex.CreateTableBuilder, knex: Knex) {
  table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null);
  table.timestamp('expired_at', { useTz: true }).nullable().defaultTo(null);
}
