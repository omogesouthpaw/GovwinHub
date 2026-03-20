export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  expiredAt: Date | null;
}

/**
 * Base columns applied to every table via addBaseColumns() helper.
 *
 * DB columns (snake_case):
 *  - id          VARCHAR(36)  PK
 *  - created_at  DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP
 *  - updated_at  DATETIME     NOT NULL  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *  - deleted_at  DATETIME     NULL      DEFAULT NULL  (soft delete)
 *  - expired_at  DATETIME     NULL      DEFAULT NULL
 */
