import { Knex } from 'knex';

/**
 * Syncs the users table to match the UserEntity definition.
 *
 * Adds missing columns used by auth & user services:
 *  - password, first_name, last_name, is_active,
 *    mfa_enabled, mfa_secret, mfa_backup_codes, refresh_token_hash
 *
 * Removes legacy columns no longer used in code:
 *  - cognito_sub, full_name, password_hash
 *
 * Makes org_id nullable (registration can happen without an org).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    // Add columns the code actually uses
    table.string('password', 255).notNullable().defaultTo('');
    table.string('first_name', 255).nullable();
    table.string('last_name', 255).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('mfa_enabled').notNullable().defaultTo(false);
    table.string('mfa_secret', 255).nullable();
    table.json('mfa_backup_codes').nullable();
    table.text('refresh_token_hash').nullable();
  });

  // Make org_id nullable (users can register without an org)
  await knex.schema.alterTable('users', (table) => {
    table.string('org_id', 36).nullable().alter();
  });

  // Drop legacy columns no longer referenced in code
  await knex.schema.alterTable('users', (table) => {
    table.dropUnique(['cognito_sub']);
    table.dropColumn('cognito_sub');
    table.dropColumn('full_name');
    table.dropColumn('password_hash');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Restore legacy columns
  await knex.schema.alterTable('users', (table) => {
    table.string('cognito_sub', 255).notNullable().unique().defaultTo('');
    table.string('full_name', 255).nullable();
    table.string('password_hash', 255).notNullable().defaultTo('');
  });

  // Make org_id required again
  await knex.schema.alterTable('users', (table) => {
    table.string('org_id', 36).notNullable().alter();
  });

  // Drop new columns
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('password');
    table.dropColumn('first_name');
    table.dropColumn('last_name');
    table.dropColumn('is_active');
    table.dropColumn('mfa_enabled');
    table.dropColumn('mfa_secret');
    table.dropColumn('mfa_backup_codes');
    table.dropColumn('refresh_token_hash');
  });
}
