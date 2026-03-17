import { BaseEntity } from './base.interface';

export interface IOpportunity extends BaseEntity {
  source: string;
  sourceId: string;
  title: string;
  description: string | null;
  agency: string | null;
  naicsCodes: string[];
  pscCodes: string[];
  setAside: string | null;
  contractType: string | null;
  placeOfPerformance: string | null;
  postedDate: Date | null;
  responseDate: Date | null;
  awardAmount: number | null;
  url: string | null;
  rawData: Record<string, any> | null;
  embedding: number[] | null;
}

export type CreateOpportunityDto = Omit<IOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateOpportunityDto = Partial<Omit<IOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>>;
