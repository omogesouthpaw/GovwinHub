import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../database';
import { BaseRepository, mapToCamelCase } from '../../database/base.repository';
import { CreateOrganizationDto, IOrganization, UpdateOrganizationDto } from './interfaces/organization.interface';
// import { IOrganization, CreateOrganizationDto, UpdateOrganizationDto } from './interfaces';

@Injectable()
export class CompanyService extends BaseRepository<IOrganization> {
  protected readonly tableName = 'organizations';

  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex);
  }

  async findByName(name: string): Promise<IOrganization | null> {
    const row = await this.activeQuery().where('name', name).first();
    return row ? mapToCamelCase(row) as IOrganization : null;
  }

  async findByNaicsCode(code: string): Promise<IOrganization[]> {
    const rows = await this.activeQuery()
      .whereRaw('JSON_CONTAINS(naics_codes, ?)', [JSON.stringify(code)]);
    return rows.map((row) => mapToCamelCase(row) as IOrganization);
  }

  async createOrganization(data: CreateOrganizationDto): Promise<IOrganization> {
    return this.create(data);
  }

  async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<IOrganization | null> {
    return this.update(id, data);
  }
}
