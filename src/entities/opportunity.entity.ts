import { BaseEntity } from './base.entity';

export interface OpportunityEntity extends BaseEntity {
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

/**
 * Table: opportunities
 *
 * Columns:
 *  - id                   VARCHAR(36)    PK
 *  - source               VARCHAR(50)    NOT NULL
 *  - source_id            VARCHAR(255)   NOT NULL
 *  - title                TEXT           NOT NULL
 *  - description          TEXT           NULL
 *  - agency               VARCHAR(255)   NULL
 *  - naics_codes          JSON           NOT NULL  DEFAULT '[]'
 *  - psc_codes            JSON           NOT NULL  DEFAULT '[]'
 *  - set_aside            VARCHAR(100)   NULL
 *  - contract_type        VARCHAR(50)    NULL
 *  - place_of_performance VARCHAR(255)   NULL
 *  - posted_date          DATETIME       NULL
 *  - response_date        DATETIME       NULL
 *  - award_amount         DECIMAL(15,2)  NULL
 *  - url                  TEXT           NULL
 *  - raw_data             JSON           NULL
 *  - embedding            JSON           NULL
 *  + base columns (created_at, updated_at, deleted_at, expired_at)
 *
 * Indexes:
 *  - UNIQUE (source, source_id)
 *  - INDEX  (agency)
 *  - INDEX  (response_date)
 */
