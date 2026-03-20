import { BaseEntity } from '../../../common/entities/base.entity';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface UserEntity extends BaseEntity {
  orgId: string | null;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaBackupCodes: string[] | null;
  refreshTokenHash: string | null;
}

/**
 * Table: users
 *
 * Columns:
 *  - id                 VARCHAR(36)                                PK
 *  - org_id             VARCHAR(36)                                NULL      FK -> organizations.id
 *  - email              VARCHAR(255)                               NOT NULL  UNIQUE
 *  - password           VARCHAR(255)                               NOT NULL
 *  - first_name         VARCHAR(255)                               NULL
 *  - last_name          VARCHAR(255)                               NULL
 *  - role               ENUM('owner','admin','editor','viewer')    NOT NULL  DEFAULT 'editor'
 *  - is_active          BOOLEAN                                    NOT NULL  DEFAULT TRUE
 *  - mfa_enabled        BOOLEAN                                    NOT NULL  DEFAULT FALSE
 *  - mfa_secret         VARCHAR(255)                               NULL
 *  - mfa_backup_codes   JSON                                       NULL
 *  - refresh_token_hash TEXT                                        NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Indexes:
 *  - UNIQUE (email)
 *
 * Foreign Keys:
 *  - org_id -> organizations.id
 */
