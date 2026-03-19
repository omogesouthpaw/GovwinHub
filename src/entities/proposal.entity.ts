import { BaseEntity } from './base.entity';

export interface ProposalEntity extends BaseEntity {
  companyId: string;
  userId: string | null;
  opportunityId: string | null;
  title: string | null;
  status: string;
  rfpFileKey: string | null;
  extractedRequirements: Record<string, any> | null;
  evaluationCriteria: Record<string, any> | null;
}

/**
 * Table: proposals
 *
 * Columns:
 *  - id                      VARCHAR(36)   PK
 *  - org_id                  VARCHAR(36)   NOT NULL  FK -> Companys.id
 *  - user_id                 VARCHAR(36)   NULL      FK -> users.id
 *  - opportunity_id          VARCHAR(36)   NULL      FK -> opportunities.id
 *  - title                   VARCHAR(255)  NULL
 *  - status                  VARCHAR(20)   NOT NULL  DEFAULT 'draft'
 *  - rfp_file_key            VARCHAR(500)  NULL
 *  - extracted_requirements  JSON          NULL
 *  - evaluation_criteria     JSON          NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Foreign Keys:
 *  - org_id         -> Companys.id
 *  - user_id        -> users.id
 *  - opportunity_id -> opportunities.id
 */
