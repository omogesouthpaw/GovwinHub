import { BaseEntity } from './base.entity';

export interface SavedOpportunityEntity extends BaseEntity {
  userId: string;
  companyId: string;
  opportunityId: string;
  notes: string | null;
}

/**
 * Table: saved_opportunities
 *
 * Columns:
 *  - id              VARCHAR(36)   PK
 *  - user_id         VARCHAR(36)   NOT NULL  FK -> users.id
 *  - company_id      VARCHAR(36)   NOT NULL  FK -> Companys.id
 *  - opportunity_id  VARCHAR(36)   NOT NULL  FK -> opportunities.id
 *  - notes           VARCHAR(500)  NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Indexes:
 *  - UNIQUE (user_id, opportunity_id)
 *  - INDEX  (company_id, opportunity_id)
 *
 * Foreign Keys:
 *  - user_id        -> users.id
 *  - company_id     -> Companys.id
 *  - opportunity_id -> opportunities.id
 */
