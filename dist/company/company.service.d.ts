import { Knex } from 'knex';
import { BaseRepository } from '../database/base.repository';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { ICompany } from 'src/interfaces';
export declare class CompanyService extends BaseRepository<ICompany> {
    protected readonly tableName = "Companies";
    constructor(knex: Knex);
    findByName(name: string): Promise<ICompany | null>;
    findByNaicsCode(code: string): Promise<ICompany[]>;
    createCompany(data: CreateCompanyDto): Promise<ICompany>;
    updateCompany(id: string, data: UpdateCompanyDto): Promise<ICompany | null>;
}
