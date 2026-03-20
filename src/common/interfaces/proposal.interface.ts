import { BaseEntity } from './base.interface';

export interface IProposal extends BaseEntity {
  orgId: string;
  opportunityId: string | null;
  title: string | null;
  status: string;
  rfpFileKey: string | null;
  extractedRequirements: Record<string, any> | null;
  evaluationCriteria: Record<string, any> | null;
}

export interface IProposalSection extends BaseEntity {
  proposalId: string;
  sectionType: string;
  title: string | null;
  content: string | null;
  sortOrder: number;
  aiGenerated: boolean;
}

export type CreateProposalDto = Omit<IProposal, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateProposalDto = Partial<Omit<IProposal, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>>;
export type CreateProposalSectionDto = Omit<IProposalSection, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>;
export type UpdateProposalSectionDto = Partial<Omit<IProposalSection, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'>>;
