import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database';
import { BaseRepository, mapToCamelCase } from '../database/base.repository';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { ICompany } from 'src/interfaces';

@Injectable()
export class CompanyService extends BaseRepository<ICompany> {
  protected readonly tableName = 'Companies';

  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex);
  }

  async findByName(name: string): Promise<ICompany | null> {
    const row = await this.activeQuery().where('name', name).first();
    return row ? mapToCamelCase(row) as ICompany : null;
  }

  async findByNaicsCode(code: string): Promise<ICompany[]> {
    const rows = await this.activeQuery()
      .whereRaw('JSON_CONTAINS(naics_codes, ?)', [JSON.stringify(code)]);
    return rows.map((row) => mapToCamelCase(row) as ICompany);
  }

  async createCompany(data: CreateCompanyDto): Promise<ICompany> {
    return await this.create(data);
  }

  async updateCompany(id: string, data: UpdateCompanyDto): Promise<ICompany | null> {
    return this.update(id, data);
  }
}
