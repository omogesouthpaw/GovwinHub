# GovWinHub

GovCon Platform API built with NestJS, Knex, and PostgreSQL.

## Prerequisites

- Node.js v20 (see `.nvmrc`) — use `nvm use` to switch automatically
- PostgreSQL 16
- npm

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

This project uses separate `.env` files per environment, loaded automatically based on `NODE_ENV`.

| `NODE_ENV` value | File loaded        | Use case            |
|------------------|--------------------|---------------------|
| `development`    | `.env.development` | Development (default) |
| `production`     | `.env.production`  | Production          |
| `test`           | `.env.test`        | Testing             |

**To get started**, copy the example file and fill in your values:

```bash
cp .env.example .env.development
```

> `.env.example` is committed to git with all required keys but no values. All other `.env.*` files are gitignored — never commit real credentials.

**Switching between local and cloud DB:**

Inside `.env.development`, two DB blocks are provided — one for local PostgreSQL, one for Neon (cloud). Comment out the one you are not using:

```env
# Local PostgreSQL — uncomment to use
# DB_HOST=localhost
# ...

# Neon (cloud dev)
DB_HOST=your-neon-host
# ...
```

**Required variables:**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `NODE_ENV` | Environment (`development`, `production`, `test`) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `DB_SSL` | Enable SSL (`true` for cloud DBs, `false` for local) |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `JWT_ACCESS_TOKEN_TTL` | Access token TTL in seconds |
| `JWT_REFRESH_TOKEN_TTL` | Refresh token TTL in seconds |

3. **Run the app**

```bash
npm run start:dev
```

## Database Migrations

Migrations are managed with Knex. The knexfile is located at `src/database/knexfile.ts`.

```bash
# Generate a new migration file
npx knex migrate:make <migration_name> --knexfile src/database/knexfile.ts

# Run all pending migrations
npm run migrate

# Rollback the last batch of migrations
npm run migrate:rollback
```

## Running the Project

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:<PORT>/v1`.

## API Documentation

Swagger docs are available in non-production environments at:

```
http://localhost:<PORT>/api/docs
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Linting & Formatting

```bash
npm run lint
npm run format
```
