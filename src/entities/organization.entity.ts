import { BaseEntity } from './base.entity';

export interface OrganizationEntity extends BaseEntity {
  name: string;
  naicsCodes: string[];
  cageCode: string | null;
  uei: string | null;
}

/**
 * Table: organizations
 *
 * Columns:
 *  - id          VARCHAR(36)   PK
 *  - name        VARCHAR(255)  NOT NULL
 *  - naics_codes JSON          NOT NULL  DEFAULT '[]'
 *  - cage_code   VARCHAR(10)   NULL
 *  - uei         VARCHAR(20)   NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 */
