import { Knex } from 'knex';
import { addBaseColumns } from './helpers';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('proposal_sections', (table) => {
    addBaseColumns(table, knex);
    table.string('proposal_id', 36).notNullable();
    table.string('section_type', 50).notNullable();
    table.string('title', 255).nullable();
    table.text('content').nullable();
    table.integer('sort_order').notNullable().defaultTo(0);
    table.boolean('ai_generated').notNullable().defaultTo(false);
    table.foreign('proposal_id').references('id').inTable('proposals').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('proposal_sections');
}
