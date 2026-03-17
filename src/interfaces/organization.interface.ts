import { BaseEntity } from './base.interface';

export interface IOrganization extends BaseEntity {
  name: string;
  naicsCodes: string[];
  cageCode: string | null;
  uei: string | null;
}

export type CreateOrganizationDto = Omit<IOrganization, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateOrganizationDto = Partial<Omit<IOrganization, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>>;
