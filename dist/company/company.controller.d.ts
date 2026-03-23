import { CompanyService } from './company.service';
import { IUser } from '../interfaces';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getMyCompany(user: IUser): Promise<import("../interfaces").ICompany>;
    createCompany(dto: CreateCompanyDto, user: IUser): Promise<import("../interfaces").ICompany>;
    updateMyCompany(dto: UpdateCompanyDto, user: IUser): Promise<import("../interfaces").ICompany>;
    getCompany(id: string, user: IUser): Promise<import("../interfaces").ICompany>;
}
