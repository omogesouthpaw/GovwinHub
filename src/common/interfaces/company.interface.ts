import { BaseEntity } from './base.interface';

export interface ICompany extends BaseEntity {
  name: string;
  naicsCodes: string[];
  cageCode: string | null;
  uei: string | null;
}

export type CreateCompanyDto = Omit<ICompany, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateCompanyDto = Partial<Omit<ICompany, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>>;
