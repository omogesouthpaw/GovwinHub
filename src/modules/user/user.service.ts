import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { KNEX_CONNECTION } from '../../database/knex.module';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(KNEX_CONNECTION) private knex: Knex) {}

  async findById(id: string) {
    return this.knex('users')
      .where({ id, is_active: true })
      .first();
  }

  async findByEmail(email: string) {
    return this.knex('users').where({ email }).first();
  }

  async findByEmailWithPassword(email: string) {
    return this.knex('users')
      .select('*')
      .where({ email, is_active: true })
      .first();
  }

  async findByIdWithMfaSecret(id: string) {
    return this.knex('users')
      .select(['id', 'mfa_enabled', 'mfa_secret', 'mfa_backup_codes'])
      .where({ id })
      .first();
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    orgId?: string;
  }) {
    const id = uuidv4();
    await this.knex('users').insert({
      id,
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      org_id: data.orgId,
    });
    return this.knex('users')
      .select('id', 'email', 'first_name', 'last_name', 'role', 'created_at')
      .where({ id })
      .first();
  }

  async updateUser(id: string, data: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    const updateData: Record<string, any> = {};
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.firstName) updateData.first_name = data.firstName;
    if (data.lastName) updateData.last_name = data.lastName;
    if (data.role) updateData.role = data.role;
    await this.knex('users').where({ id }).update(updateData);
    return this.findById(id);
  }

  async softDelete(id: string) {
    await this.knex('users').where({ id }).update({ is_active: false });
  }

  async findByOrganization(orgId: string) {
    return this.knex('users')
      .where({ org_id: orgId, is_active: true })
      .select('id', 'email', 'first_name', 'last_name', 'role', 'created_at');
  }

  async saveMfaSecret(id: string, secret: string) {
    await this.knex('users').where({ id }).update({
      mfa_secret: secret,
      mfa_enabled: false,
    });
  }

  async enableMfa(id: string) {
    await this.knex('users').where({ id }).update({ mfa_enabled: true });
  }

  async saveRefreshTokenHash(id: string, hash: string) {
    await this.knex('users').where({ id }).update({ refresh_token_hash: hash });
  }

  async updateBackupCodes(id: string, codes: string[]) {
    await this.knex('users').where({ id }).update({ mfa_backup_codes: codes });
  }

  async clearRefreshToken(id: string) {
    await this.knex('users').where({ id }).update({ refresh_token_hash: null });
  }
}
