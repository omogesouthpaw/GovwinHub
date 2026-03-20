import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../database';
import { BaseRepository, mapToCamelCase } from '../../database/base.repository';
import { CreateOpportunityDto, IOpportunity } from './interfaces/opportunity.interface';

@Injectable()
export class OpportunitiesService extends BaseRepository<IOpportunity> {
  protected readonly tableName = 'opportunities';

  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex);
  }

  async findBySourceAndSourceId(source: string, sourceId: string): Promise<IOpportunity | null> {
    const row = await this.activeQuery()
      .where('source', source)
      .where('source_id', sourceId)
      .first();
    return row ? mapToCamelCase(row) as IOpportunity : null;
  }

  async findByAgency(agency: string): Promise<IOpportunity[]> {
    const rows = await this.activeQuery().where('agency', agency);
    return rows.map((row) => mapToCamelCase(row) as IOpportunity);
  }

  async findUpcoming(limit = 50): Promise<IOpportunity[]> {
    const rows = await this.activeQuery()
      .where('response_date', '>=', new Date())
      .orderBy('response_date', 'asc')
      .limit(limit);
    return rows.map((row) => mapToCamelCase(row) as IOpportunity);
  }

  async upsert(data: CreateOpportunityDto): Promise<IOpportunity> {
    const existing = await this.findBySourceAndSourceId(data.source, data.sourceId);
    if (existing) {
      return this.update(existing.id, data);
    }
    return this.create(data);
  }

  async findByNaicsCode(code: string): Promise<IOpportunity[]> {
    const rows = await this.activeQuery()
      .whereRaw('JSON_CONTAINS(naics_codes, ?)', [JSON.stringify(code)]);
    return rows.map((row) => mapToCamelCase(row) as IOpportunity);
  }
}
