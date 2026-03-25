import knex, { Knex } from 'knex';

export interface KnexConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: { rejectUnauthorized: boolean } | false;
}

export function createKnexInstance(options: KnexConnectionOptions): Knex {
  return knex({
    client: 'pg',
    connection: {
      host: options.host,
      port: options.port,
      user: options.user,
      password: options.password,
      database: options.database,
      ssl: options.ssl,
    },
    pool: {
      min: 2,
      max: 10,
    },
  });
}
