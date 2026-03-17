import { CompanyService } from './company.service';
import { IUser } from '../interfaces';
import { UpdateCompanyDto } from './dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getMyCompany(user: IUser): Promise<import("../interfaces").IOrganization>;
    updateMyCompany(dto: UpdateCompanyDto, user: IUser): Promise<import("../interfaces").IOrganization | null>;
    getCompany(id: string, user: IUser): Promise<import("../interfaces").IOrganization>;
}
