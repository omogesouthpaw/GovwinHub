# GovWinHub

GovCon Platform API built with NestJS, Knex, and MySQL.

## Prerequisites

- Node.js v20 (see `.nvmrc`)
- MySQL 8.x
- npm

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy the example and update values as needed:

```bash
cp .env.example .env
```

Required variables:

| Variable              | Description                  | Default                  |
| --------------------- | ---------------------------- | ------------------------ |
| `PORT`                | Server port                  | `3000`                   |
| `NODE_ENV`            | Environment                  | `development`            |
| `DB_HOST`             | MySQL host                   | `localhost`              |
| `DB_PORT`             | MySQL port                   | `3306`                   |
| `DB_USER`             | MySQL user                   | `root`                   |
| `DB_PASSWORD`         | MySQL password               |                          |
| `DB_NAME`             | MySQL database name          | `govwinhub`              |
| `JWT_ACCESS_SECRET`   | Secret for access tokens     | **required**             |
| `JWT_SECRET`          | General JWT secret           | **required**             |
| `JWT_REFRESH_SECRET`  | Secret for refresh tokens    | **required**             |
| `JWT_ACCESS_TOKEN_TTL`| Access token TTL (seconds)   | `3600`                   |
| `JWT_REFRESH_TOKEN_TTL`| Refresh token TTL (seconds) | `86400`                  |

3. **Create the database**

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS \`govcon-application\`;"
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
