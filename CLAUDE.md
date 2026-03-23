# CLAUDE.md — GovWinHub Backend
> This file is the persistent context for all Claude Code sessions on this project.
> Read this fully before writing any code, making architecture decisions, or answering questions.

---

## 1. Project Identity

**Project:** GovWinHub — AI-Powered Government Contract Management Platform
**Role:** Backend Developer (Lead)
**Phase:** MVP — 9 weeks core development (Milestones 1–3) + Phase 4 support (Weeks 10–16)
**Current Milestone:** Milestone 1 — Core Backend Foundation (Weeks 1–3)

**What this product does:**
GovWinHub is a SaaS platform that aggregates federal and state government contracting
opportunities and provides AI-driven bid-management tools. It targets small and mid-size
government contractors, proposal managers, and capture managers.

**Core value proposition:**
1. Find contracts faster — aggregated from SAM.gov, Grants.gov, and state portals
2. Write proposals faster — AI-driven proposal generator using stored past performance
3. Bid smarter — automated win-probability scoring and opportunity qualification

---

## 2. Technology Stack

### Core Runtime
| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 LTS |
| Language | TypeScript 5.4 (strict mode — non-negotiable) |
| Framework | NestJS 10 |
| Package Manager | pnpm |

### Database & Storage
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary DB | PostgreSQL 16 (AWS RDS) | All relational data |
| ORM | TypeORM 0.3 | NestJS-native, migration support, decorator entities |
| Search | OpenSearch 2.11 (AWS managed) | Full-text opportunity search, faceted filtering |
| Cache & Queues | Redis 7 (ElastiCache) | Caching, rate limiting, BullMQ broker |
| Queue | BullMQ | Job scheduling, retries, concurrency for ingestion & AI |
| Vector Store | pgvector on PostgreSQL | Embeddings for semantic search & past performance matching |
| File Storage | AWS S3 | RFP uploads, DOCX exports, past performance documents |
| Migrations | TypeORM CLI | Schema versioning |

### AI Layer
| Component | Technology | Notes |
|-----------|-----------|-------|
| Primary LLM | Anthropic Claude Sonnet 4 (`@anthropic-ai/sdk`) | Proposal gen, RFP extraction, summarization |
| Fallback LLM | OpenAI GPT-4o (`openai` npm) | Redundancy only |
| Embeddings | OpenAI `text-embedding-3-small` | 1536-dim vectors for semantic matching |
| Document Parsing | `pdf-parse` + `mammoth` | PDF and DOCX text extraction |
| Structured Extraction | Claude `tool_use` / function calling | Reliable JSON extraction from RFPs |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Cloud | AWS |
| Containerization | Docker |
| Orchestration | AWS ECS Fargate |
| CI/CD | GitHub Actions |
| IaC | Terraform |
| Monitoring | AWS CloudWatch + X-Ray |
| Secrets | AWS Secrets Manager |
| Email | SendGrid (`@sendgrid/mail`) |
| Auth | AWS Cognito + Passport.js (`@nestjs/passport`) |

---

## 3. Architecture

### Pattern: NestJS Modular Monolith
Each domain is a NestJS module with its own controllers, services, entities, and DTOs.
Single deployable unit with clear boundaries. Do NOT build microservices.

### Module Domains
```
src/
├── auth/              # JWT, MFA (TOTP), RBAC, Cognito integration
├── opportunities/     # Opportunity entity, search, filtering
├── pipeline/          # Pipeline stages, assignments, notes, attachments
├── proposals/         # Proposal generation, RFP parsing, DOCX export
├── past-performance/  # Document library, AI extraction, semantic search
├── scoring/           # Win-probability scoring engine
├── alerts/            # Email + in-app notifications, saved searches
├── ingestion/         # SAM.gov + Grants.gov fetcher/transformer/upsert
├── ai/                # Shared AI service (pluggable LLM provider)
├── teams/             # Collaboration, comments, activity log
└── common/            # Guards, interceptors, decorators, DTOs, pipes
```

### Key Architecture Principles
1. **Dependency injection everywhere** — use Nest's DI container for testability
2. **CQRS-lite** — search reads from OpenSearch/Redis, writes go to PostgreSQL
3. **Queue-driven async** — ingestion, AI generation, and scoring run via BullMQ workers, NEVER in request threads
4. **AI as pluggable provider** — injectable service with interface abstraction, swap Claude ↔ OpenAI without changing business logic
5. **Multi-tenancy from day one** — every tenant-specific table has `organization_id`. Opportunity data from SAM.gov/Grants.gov is shared/read-only across tenants.

### High-Level Architecture Diagram
```
API Gateway / Nginx (Rate Limit + SSL)
         │
    NestJS App (Modular Monolith)
    │        │        │        │
PostgreSQL  Redis  OpenSearch  S3
+ pgvector  (Cache  (Search)  (Files)
            + BullMQ)
```

---

## 4. Database Schema

### Core Tables

#### `opportunities`
Stores all federal contract opportunities ingested from SAM.gov and Grants.gov.
```sql
id                UUID (PK)
notice_id         TEXT UNIQUE          -- Federal notice ID, dedup key
title             TEXT                 -- Max 500 chars
agency            TEXT
sub_agency        TEXT
office            TEXT
solicitation_type TEXT                 -- Enum: RFP, RFQ, Sources Sought, Other
naics_codes       TEXT[]               -- Array of 6-digit NAICS codes
psc_codes         TEXT[]               -- Array of 4-char PSC codes
set_aside         TEXT nullable        -- 8(a), SDVOSB, HUBZone, WOSB, or null
response_deadline TIMESTAMPTZ
posted_date       TIMESTAMPTZ
estimated_value   BIGINT nullable      -- USD whole dollars
place_of_performance TEXT             -- Format: "City, ST"
description       TEXT                 -- Max 10K chars, HTML stripped
url               TEXT                 -- SAM.gov listing link
active            BOOLEAN
source            TEXT                 -- 'SAM.GOV' | 'GRANTS.GOV'
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

#### `qualifications`
Go/No-Go assessments linked to opportunities.
```sql
id                   UUID (PK)
opportunity_id       UUID FK → opportunities.id CASCADE
naics_fit            TEXT    -- Enum: Yes, No, Unsure
past_performance_fit TEXT    -- Enum: Yes, No, Unsure
set_aside_eligibility TEXT   -- Enum: Yes, No, Unsure
contract_size_fit    TEXT    -- Enum: Yes, No, Unsure
capacity_to_bid      TEXT    -- Enum: Yes, No, Unsure
weighted_score       INTEGER -- 0–10 (each criterion: Yes=2, Unsure=1, No=0)
final_decision       TEXT    -- Enum: Go, No-Go
rationale            TEXT
created_by           UUID FK → users.id
created_at / updated_at TIMESTAMPTZ
```
**Scoring logic:** Score ≥ 4 = Go, Score < 4 = No-Go.

#### `pipeline_items`
Tracks opportunities through bid pipeline stages.
```sql
id             UUID (PK)
opportunity_id UUID FK → opportunities.id CASCADE
organization_id UUID FK                   -- Multi-tenancy
stage          TEXT    -- Discover, Qualify, Pursue, Proposal, Submitted, Awarded, Lost, Archived
due_date       TIMESTAMPTZ
owner          UUID FK → users.id
notes          TEXT    -- Rich text
created_at / updated_at TIMESTAMPTZ
```

#### `users`
```sql
id              UUID (PK)
email           TEXT UNIQUE
password_hash   TEXT
organization_id UUID FK
role            TEXT    -- Enum: Admin, Manager, User
mfa_secret      TEXT nullable   -- TOTP secret
mfa_enabled     BOOLEAN
cognito_sub     TEXT nullable
created_at / updated_at TIMESTAMPTZ
```

#### `companies` / `organizations`
```sql
id           UUID (PK)
name         TEXT
naics_codes  TEXT[]
capabilities TEXT
subscription_tier TEXT   -- For SaaS billing
created_at / updated_at TIMESTAMPTZ
```

#### Automation & Logging Tables
- `notifications` — user notifications with read status
- `automation_logs` — audit trail of all automated actions
- `scheduler_runs` — history of automation executions
- `ingestion_logs` — SAM.gov/Grants.gov sync run history with record counts and error details

### Recommended Indexes
```sql
opportunities:  agency, response_deadline, active, notice_id (unique)
qualifications: opportunity_id
pipeline_items: opportunity_id, stage, owner, organization_id
notifications:  user_id, read
ingestion_logs: started_at, status
```

---

## 5. SAM.gov Field Mappings (Ingestion Reference)

> Use this as the primary reference when building the ingestion/transformer service.
> FAIL transformation if any of these are missing: notice_id, title, agency, response_deadline, posted_date, url

| GovWinHub Field | SAM.gov Source | Transformation |
|----------------|---------------|---------------|
| notice_id | noticeId | Direct, trim whitespace |
| title | title | Direct, limit 500 chars |
| agency | fullParentPathName | Extract first component (split on ".") |
| sub_agency | subTier / subtierName | Extract second component |
| office | office / officeAddress | Third component or city/state |
| solicitation_type | type | Map to enum (see below) |
| naics_codes | naicsCode | Convert to array |
| psc_codes | classificationCode | Convert to array |
| set_aside | typeOfSetAside | Map to categories |
| response_deadline | responseDeadLine | Parse ISO 8601 |
| posted_date | postedDate | Parse ISO 8601 |
| estimated_value | awardAmount | Parse currency, take max (bigint) |
| place_of_performance | placeOfPerformance | Format "City, ST" |
| description | description | Strip HTML, limit 10K |
| url | uiLink | Use or construct from ID |
| active | active / archiveDate | Boolean determination |

### Solicitation Type Mappings
| SAM.gov Value | GovWinHub Value |
|--------------|----------------|
| "Solicitation", "Presolicitation", "Combined Synopsis/Solicitation" | "RFP" |
| "Sources Sought", "Request for Information" | "Sources Sought" |
| Everything else | "Other" |
> Distinguish RFP vs RFQ: check solicitationNumber prefix — "R" = RFP, "Q" = RFQ

### Set-Aside Mappings
| SAM.gov | GovWinHub |
|---------|----------|
| "SBA" / "8AN" / "8A" | "8(a)" |
| "SDVOSBC" / "SDVOSB" / "SBP" | "SDVOSB" |
| "HZC" / "HZS" | "HUBZone" |
| "WOSB" / "EDWOSB" | "WOSB" |
| "SB" / "VSB" / "VSA" | null |
| null or empty | null |

### Agency Name Extraction
`fullParentPathName` format: `"PARENT.SUB_TIER.OFFICE"`
1. Split on "." (period)
2. First component → `agency`
3. Second component → `sub_agency` (else use agency)
4. Third component → `office` (else use officeAddress or "Not Specified")
5. Clean: "DEPT OF" → "Department of", "ADMIN" → "Administration"

### Place of Performance
- Missing city → use state only: "WA"
- Missing state → use city only: "Seattle"
- Both missing → "Various" (common for nationwide contracts)
- International → country code: "London, UK"

### Value Parsing
- Exact: "$12,500,000" → 12500000
- Range: "$10M - $15M" → 15000000 (take max)
- Threshold: "Over $250M" → 250000000
- Text: "See solicitation" → null
> Extract numeric via regex, remove commas, multiply by 1M if "M"/"Million" present. Return null if no valid number.

### Active Status Priority
1. `active` field if present ("Yes" → true)
2. `archiveDate` — if past, active = false
3. `responseDeadLine` — if past, active = false
4. Default: true

### Default Values for Missing Fields
| Field | Default |
|-------|---------|
| sub_agency | Same as agency |
| office | "Not Specified" |
| place_of_performance | "Various" |
| naics_codes | [] |
| psc_codes | [] |
| set_aside | null |
| estimated_value | null |
| description | "See SAM.gov for details" |

---

## 6. Ingestion Architecture

### Processing Pipeline (4 modules, sequential)
1. **Fetcher** — GET `https://api.sam.gov/opportunities/v2/search` with pagination, exponential backoff on 5xx, fail fast on 4xx
2. **Transformer** — Apply field mappings above, handle missing fields, normalize formats
3. **Validator** — Check required fields, data types, enum values, URL formats, NAICS/PSC code formats
4. **Upsert Engine** — `INSERT ... ON CONFLICT (notice_id)` for idempotency, only update if data changed

### Key SAM.gov API Params
- `api_key` — stored in env (required)
- `postedFrom` / `postedTo` — date range for incremental sync (YYYY-MM-DD)
- `limit` — max 1000 per page
- `offset` — pagination
- Rate limits: 10 req/sec, 1000 req/day (varies by key tier)

### Ingestion Logging (ingestion_logs table)
Every sync run logs: `sync_id`, `started_at`, `completed_at`, `inserted`, `updated`, `skipped`, `failed`, `duration_seconds`, `error_details`, `status` (completed/partial/failed)

### Error Handling
- API 5xx → retry with exponential backoff
- API 4xx → fail fast (auth issue)
- Transform errors → skip record, log, continue
- DB errors → atomic per-record transactions
- Concurrency → advisory lock prevents overlapping sync runs

### Monitoring Alerts
- Sync failure → alert immediately
- Sync duration > 2x average → performance degradation alert
- Error rate > 5% → data quality alert
- No successful sync in 7 days → service outage alert

---

## 7. Workflow Automation (Scheduler)

Runs every hour (`cron: 0 * * * *`). Operates autonomously.

### Automation Rules
| Rule | Trigger | Action |
|------|---------|--------|
| Deadline Warning | 7 days until deadline | Warning notification (max 1/24h per opportunity) |
| Deadline Warning | 3 days until deadline | Urgent notification |
| Expired Opportunity | responseDeadline < now() AND active | Mark active=false, move to Archived, notify owner |
| Qualification Reminder | Active opp, no qualification, no reminder in 7 days | Notify Analysts, Capture Managers, Admins |
| Pipeline Auto-Advance | Qualification=Go, deadline ≤ 7 days, stage is Discovered/Qualified | Move to Ready to Bid, notify owner |
| No-Go Archival | Qualification=No-Go, stage not Lost/Archived | Move to Archived, notify owner |
| Auto-Add to Pipeline | Qualification=Go, not in pipeline, still active | Create pipeline item at Qualified stage |

### Idempotency Rules
- Deadline warnings: max one per 24h per opportunity
- Qualification reminders: max one per 7 days per opportunity
- Pipeline changes: check current stage before updating
- Manual overrides respected

---

## 8. Pipeline Stages

```
Discover → Qualify → Pursue → Proposal → Submitted → Awarded / Lost / Archived
```

| Stage | Transition Trigger |
|-------|-------------------|
| Discover | Automatic on ingestion |
| Qualify | Automatic when qualification = Go |
| Ready to Bid | Automatic when Go + deadline ≤ 7 days |
| Bid in Progress | Manual by Capture Manager |
| Submitted | Manual by Capture Manager |
| Awarded | Manual by Capture Manager/Admin |
| Lost | Manual by Capture Manager/Admin |
| Archived | Automatic on expiry or No-Go |

Custom stages can be created, reordered, and deleted per organization.

---

## 9. Role-Based Access Control (RBAC)

### Roles
| Role | Key Permissions | Restrictions |
|------|----------------|-------------|
| User (Analyst) | View opportunities, apply filters, complete qualifications, view pipeline (read-only) | Cannot move pipeline stages, no user management |
| Manager (Capture Manager) | All User perms + move pipeline stages, edit dates/notes, finalize Go/No-Go | No user management |
| Admin | All Manager perms + user management, role assignment, system config, automation monitoring | None |

### Permission Enforcement (Defense in Depth)
1. API Layer — permission guards on every endpoint before processing
2. Database Layer — row-level security / organization_id checks

---

## 10. Win-Probability Scoring Engine

### Inputs (each scored: Yes=2, Unsure=1, No=0)
- Past performance match
- NAICS code alignment
- Agency familiarity
- Contract size vs. company size
- Competition level
- Set-aside eligibility

### Output
- Score 0–100 with color coding: Red < 40, Yellow 40–70, Green > 70
- Go/No-Go recommendation with explanation text
- Detailed score factor breakdown

### Thresholds
- Score ≥ 4 (out of 10 on qual assessment) = Go
- Score < 4 = No-Go

---

## 11. AI Features Summary

### Proposal Generator
1. Upload RFP (PDF, DOCX)
2. AI extracts: requirements, evaluation criteria, submission instructions
3. Generate sections: Executive Summary, Technical Approach, Management Approach, Staffing Plan, Past Performance
4. Use stored past performance library for context
5. Export to DOCX (`docx` npm library)

### Past Performance Library
- Upload documents → AI extracts: contract value, period of performance, customer/agency, scope, achievements
- pgvector semantic search for matching past performance to opportunities
- Tagging system, manual override API

### RFP Drafting Tool
- Inputs: scope, deliverables, period of performance, contract type, evaluation criteria
- Outputs: Statement of Work (SOW), Performance Work Statement (PWS), evaluation criteria, submission instructions
- Export to DOCX

### AI Service Interface Pattern
```typescript
// Always use this interface pattern — never call Claude/OpenAI SDK directly from business logic
interface AIProvider {
  complete(prompt: string, options?: AIOptions): Promise<string>;
  extractStructured<T>(prompt: string, schema: JSONSchema): Promise<T>;
  embed(text: string): Promise<number[]>;
}
```

---

## 12. External Integrations

### SAM.gov
- API endpoint: `GET https://api.sam.gov/opportunities/v2/search`
- Auth: `api_key` query param (stored in env)
- Credentials: provided by client by Week 2

### Grants.gov
- Daily ingestion, same unified opportunity schema as SAM.gov
- Cross-source deduplication with SAM.gov
- Credentials: provided by client by Week 2

### SendGrid
- Email alerts for new opportunity matches
- Deadline warnings
- Team assignment notifications
- Credentials: provided by client by Week 4

### AWS Services
- S3: file uploads (RFPs, past performance docs, DOCX exports)
- Cognito: user auth (integrated with Passport.js)
- ECS Fargate: container orchestration
- ElastiCache: Redis instance
- RDS: PostgreSQL instance
- Credentials: provided by client by Week 1

---

## 13. Coding Standards (Non-Negotiable)

### TypeScript
- Strict mode always on
- No `any` types — use `unknown` and narrow properly
- All public methods must have JSDoc comments
- All entities/DTOs must have complete TypeScript interfaces

### NestJS Conventions
- All endpoints must have `@ApiOperation`, `@ApiResponse` Swagger decorators
- All DTOs use `class-validator` decorators for validation
- Use `@UseGuards(JwtAuthGuard, RolesGuard)` on all protected routes
- Global exception filter for standardized error responses

### Standardized API Response Format
```typescript
// Success
{
  success: true,
  data: T,
  meta?: { page: number, limit: number, total: number }  // for paginated responses
}

// Error
{
  success: false,
  error: {
    code: string,      // e.g. "OPPORTUNITY_NOT_FOUND"
    message: string,   // Human-readable
    details?: unknown  // Validation errors etc.
  }
}
```

### Git & Delivery
- Code committed daily to project GitHub/GitLab (PM-controlled)
- API contracts shared with frontend dev at least 1 week before implementation
- Respond to PM feedback within 24 hours during active development
- ESLint + Prettier configuration must be followed — no exceptions

### Testing
- Jest + Supertest
- Target: 70–80% coverage on critical paths (auth, ingestion, scoring, pipeline)
- Separate test DB configuration
- Unit tests for all services, integration tests for all API endpoints

---

## 14. Environment Variables (.env structure)

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/govwinhub
DATABASE_TEST_URL=postgresql://user:pass@localhost:5432/govwinhub_test

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_CLIENT_ID=

# AI Providers (client provides)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# External APIs (client provides)
SAM_GOV_API_KEY=
GRANTS_GOV_API_KEY=

# SendGrid (client provides)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# OpenSearch
OPENSEARCH_URL=http://localhost:9200
```

---

## 15. Milestone Tracker

### Milestone 1 — Core Backend Foundation (Weeks 1–3) ← CURRENT
**Goal:** Stable backend where users can authenticate and opportunities can be stored/retrieved.

**Deliverables checklist:**
- [ ] NestJS project setup (Node.js 20 + TypeScript strict)
- [ ] Modular monolith structure with module domains
- [ ] Environment config + secrets management
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker config (dev + deployment)
- [ ] PostgreSQL setup + all core schemas (Users, Companies, Opportunities, Pipeline Items)
- [ ] pgvector extension installed and verified
- [ ] TypeORM migrations system
- [ ] Seed data scripts
- [ ] JWT auth (NestJS Passport + JWT strategy)
- [ ] MFA support (TOTP-based)
- [ ] RBAC: Admin, Manager, User with permission guards
- [ ] Password hashing (bcrypt) + refresh token rotation
- [ ] Base REST CRUD endpoints for all core entities
- [ ] Swagger/OpenAPI auto-generation
- [ ] class-validator DTOs
- [ ] Global error handling + standardized response format
- [ ] API rate limiting middleware
- [ ] CORS configuration
- [ ] Jest + Supertest setup + initial unit tests

**Acceptance Criteria:**
- User can register, log in, receive JWT tokens, access protected endpoints
- MFA enrollment and verification flow works end-to-end
- RBAC prevents unauthorized access (tested for all 3 roles)
- Swagger docs accessible and accurate
- CI/CD runs tests and builds on every push
- pgvector installed and test vector query returns results

**Client dependencies for M1:**
- AWS/Azure account credentials → needed by Week 1

---

### Milestone 2 — Opportunity Ingestion & Pipeline Management (Weeks 4–6)
**Goal:** Automated ingestion from federal sources + pipeline tracking + notifications.

Key additions: SAM.gov integration, Grants.gov integration, full-text + advanced search (Redis caching),
pipeline management (custom stages, notes, attachments, deadlines), SendGrid email alerts,
in-app notifications (WebSocket), BullMQ job setup.

**Client dependencies for M2:**
- SAM.gov API credentials → Week 2
- Grants.gov API credentials → Week 2
- SendGrid account credentials → Week 4

---

### Milestone 3 — AI Scoring, Proposal Generation & Intelligence Layer (Weeks 7–9)
**Goal:** All AI-powered capabilities.

Key additions: Win-probability scoring engine (Claude API), AI proposal generator (RFP upload → section drafts → DOCX export),
past performance library (upload → AI extraction → pgvector semantic search → tagging),
AI RFP drafting tool (SOW/PWS generation → DOCX export).

**Client dependencies for M3:**
- AI API keys (Claude/OpenAI) with sufficient credits → Week 6
- 10–15 sample RFP documents for testing → Week 6
- 5–10 past performance documents for testing → Week 6

---

### Phase 4 — Integration Support, Collaboration APIs & Launch (Weeks 10–16)
Key additions: Team collaboration APIs (invitations, threaded comments, @mentions, activity log),
frontend integration support, UAT bug fixes (up to 3 rounds), production deployment to AWS.

---

## 16. Multi-Tenancy Rules

- Every tenant-specific table MUST have `organization_id UUID FK`
- Opportunity data from SAM.gov/Grants.gov is **shared read-only** — no `organization_id` on opportunities
- Tenant-specific: pipeline_items, qualifications, proposals, past_performance, notifications, users
- API layer must enforce `organization_id` from JWT on all tenant-specific queries
- Never allow cross-tenant data access

---

## 17. SaaS Considerations

- Subscription management: Stripe integration (Phase 4+)
- Per-tenant API rate limits based on subscription tier
- Self-service registration, organization creation, team invites
- Saved searches + alerts per user (NAICS codes, agencies, set-asides as saved criteria)
- FedRAMP-aligned architecture (not full compliance at MVP)
- SOC 2 readiness: data encryption at rest + in transit, audit logs

---

## 18. Do Not Do

- ❌ Do NOT build microservices — this is a modular monolith
- ❌ Do NOT call AI SDKs directly from business logic — always go through the AI service interface
- ❌ Do NOT run ingestion, AI generation, or scoring in request threads — always queue via BullMQ
- ❌ Do NOT use `any` TypeScript types
- ❌ Do NOT skip Swagger decorators on any endpoint
- ❌ Do NOT access tenant data without enforcing `organization_id`
- ❌ Do NOT use Prisma — TypeORM 0.3 is the chosen ORM
- ❌ Do NOT use npm or yarn — pnpm only
- ❌ Do NOT hardcode credentials — always use env vars via ConfigService

---

## 19. Key Reference Documents

When working on specific modules, reference these sections of project documentation:

| Working on... | Reference |
|--------------|-----------|
| Ingestion service | Sections 5 & 6 of this file (SAM.gov field mappings + ingestion architecture) |
| Workflow automation / scheduler | Section 7 of this file (automation rules) |
| Pipeline management | Section 8 of this file (stages + transitions) |
| Scoring / qualification | Section 10 of this file (scoring logic) |
| RBAC / permissions | Section 9 of this file (role definitions) |
| AI features | Section 11 of this file (AI features summary) |
| Database schema | Section 4 of this file (core tables) |
