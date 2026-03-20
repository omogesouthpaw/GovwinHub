import { BaseEntity } from 'src/common/entities/base.entity';

export interface ProposalSectionEntity extends BaseEntity {
  proposalId: string;
  sectionType: string;
  title: string | null;
  content: string | null;
  sortOrder: number;
  aiGenerated: boolean;
}

/**
 * Table: proposal_sections
 *
 * Columns:
 *  - id            VARCHAR(36)   PK
 *  - proposal_id   VARCHAR(36)   NOT NULL  FK -> proposals.id ON DELETE CASCADE
 *  - section_type  VARCHAR(50)   NOT NULL
 *  - title         VARCHAR(255)  NULL
 *  - content       TEXT          NULL
 *  - sort_order    INT           NOT NULL  DEFAULT 0
 *  - ai_generated  BOOLEAN       NOT NULL  DEFAULT FALSE
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Foreign Keys:
 *  - proposal_id -> proposals.id (ON DELETE CASCADE)
 */
