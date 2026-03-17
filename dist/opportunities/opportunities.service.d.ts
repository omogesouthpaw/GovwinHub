import { Knex } from 'knex';
import { BaseRepository } from '../database/base.repository';
import { IOpportunity, CreateOpportunityDto } from '../interfaces';
export declare class OpportunitiesService extends BaseRepository<IOpportunity> {
    protected readonly tableName = "opportunities";
    constructor(knex: Knex);
    findBySourceAndSourceId(source: string, sourceId: string): Promise<IOpportunity | null>;
    findByAgency(agency: string): Promise<IOpportunity[]>;
    findUpcoming(limit?: number): Promise<IOpportunity[]>;
    upsert(data: CreateOpportunityDto): Promise<IOpportunity>;
    findByNaicsCode(code: string): Promise<IOpportunity[]>;
}
