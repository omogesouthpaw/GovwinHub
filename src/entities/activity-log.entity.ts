import { BaseEntity } from './base.entity';

export interface ActivityLogEntity extends BaseEntity {
  companyId: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata: Record<string, any> | null;
}

/**
 * Table: activity_log
 *
 * Columns:
 *  - id          VARCHAR(36)   PK
 *  - org_id      VARCHAR(36)   NOT NULL  FK -> Companys.id
 *  - user_id     VARCHAR(36)   NOT NULL  FK -> users.id
 *  - entity_type VARCHAR(50)   NOT NULL
 *  - entity_id   VARCHAR(36)   NOT NULL
 *  - action      VARCHAR(50)   NOT NULL
 *  - metadata    JSON          NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Indexes:
 *  - INDEX (entity_type, entity_id)
 *
 * Foreign Keys:
 *  - org_id  -> Companys.id
 *  - user_id -> users.id
 */
