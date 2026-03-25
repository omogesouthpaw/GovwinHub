import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) });
}

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

const baseConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'govcon',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'govcon',
    ssl,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
    extension: 'ts',
  },
};

const config = {
  development: {
    ...baseConfig,
    pool: { min: 2, max: 10 },
  },
  production: {
    ...baseConfig,
    pool: { min: 2, max: 20 },
  },
  test: {
    ...baseConfig,
    connection: {
      ...baseConfig.connection,
      database: process.env.DB_NAME_TEST || 'govwinhub_test',
    },
    pool: { min: 1, max: 5 },
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
