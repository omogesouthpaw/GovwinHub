import { Knex } from 'knex';
import { BaseRepository } from '../database/base.repository';
import { IOrganization, CreateOrganizationDto, UpdateOrganizationDto } from '../interfaces';
export declare class CompanyService extends BaseRepository<IOrganization> {
    protected readonly tableName = "organizations";
    constructor(knex: Knex);
    findByName(name: string): Promise<IOrganization | null>;
    findByNaicsCode(code: string): Promise<IOrganization[]>;
    createOrganization(data: CreateOrganizationDto): Promise<IOrganization>;
    updateOrganization(id: string, data: UpdateOrganizationDto): Promise<IOrganization | null>;
}
