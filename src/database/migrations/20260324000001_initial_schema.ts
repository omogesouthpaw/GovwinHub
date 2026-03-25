import { Knex } from 'knex';
import { addBaseColumns } from '../helpers';

export async function up(knex: Knex): Promise<void> {
  // 1. organizations
  await knex.schema.createTable('organizations', (table) => {
    addBaseColumns(table, knex);
    table.string('name', 255).notNullable();
    table.jsonb('naics_codes').nullable();
    table.string('cage_code', 10).nullable();
    table.string('uei', 20).nullable();
  });

  // 2. users
  await knex.schema.createTable('users', (table) => {
    addBaseColumns(table, knex);
    table.uuid('org_id').nullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable().defaultTo('');
    table.string('first_name', 255).nullable();
    table.string('last_name', 255).nullable();
    table.string('cognito_sub', 255).nullable().unique();
    table.enum('role', ['owner', 'admin', 'editor', 'viewer']).notNullable().defaultTo('editor');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('mfa_enabled').notNullable().defaultTo(false);
    table.string('mfa_secret', 255).nullable();
    table.jsonb('mfa_backup_codes').nullable();
    table.text('refresh_token_hash').nullable();
    table.foreign('org_id').references('id').inTable('organizations');
  });

  // 3. opportunities
  await knex.schema.createTable('opportunities', (table) => {
    addBaseColumns(table, knex);
    table.string('source', 50).notNullable();
    table.string('source_id', 255).notNullable();
    table.text('title').notNullable();
    table.text('description').nullable();
    table.string('agency', 255).nullable();
    table.jsonb('naics_codes').nullable();
    table.jsonb('psc_codes').nullable();
    table.string('set_aside', 100).nullable();
    table.string('contract_type', 50).nullable();
    table.string('place_of_performance', 255).nullable();
    table.datetime('posted_date').nullable();
    table.datetime('response_date').nullable();
    table.decimal('award_amount', 15, 2).nullable();
    table.text('url').nullable();
    table.jsonb('raw_data').nullable();
    table.jsonb('embedding').nullable();
    table.unique(['source', 'source_id']);
    table.index(['agency']);
    table.index(['response_date']);
  });

  // 4. proposals
  await knex.schema.createTable('proposals', (table) => {
    addBaseColumns(table, knex);
    table.uuid('org_id').notNullable();
    table.uuid('user_id').nullable();
    table.uuid('opportunity_id').nullable();
    table.string('title', 255).nullable();
    table.string('status', 20).notNullable().defaultTo('draft');
    table.string('rfp_file_key', 500).nullable();
    table.jsonb('extracted_requirements').nullable();
    table.jsonb('evaluation_criteria').nullable();
    table.foreign('org_id').references('id').inTable('organizations');
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('opportunity_id').references('id').inTable('opportunities');
  });

  // 5. proposal_sections
  await knex.schema.createTable('proposal_sections', (table) => {
    addBaseColumns(table, knex);
    table.uuid('proposal_id').notNullable();
    table.string('section_type', 50).notNullable();
    table.string('title', 255).nullable();
    table.text('content').nullable();
    table.integer('sort_order').notNullable().defaultTo(0);
    table.boolean('ai_generated').notNullable().defaultTo(false);
    table.foreign('proposal_id').references('id').inTable('proposals').onDelete('CASCADE');
  });

  // 6. activity_log
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

  // 7. saved_opportunities
  await knex.schema.createTable('saved_opportunities', (table) => {
    addBaseColumns(table, knex);
    table.uuid('user_id').notNullable();
    table.uuid('company_id').notNullable();
    table.uuid('opportunity_id').notNullable();
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
  await knex.schema.dropTableIfExists('activity_log');
  await knex.schema.dropTableIfExists('proposal_sections');
  await knex.schema.dropTableIfExists('proposals');
  await knex.schema.dropTableIfExists('opportunities');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('organizations');
}
