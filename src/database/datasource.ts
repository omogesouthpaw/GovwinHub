import knex, { Knex } from 'knex';

export interface KnexConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function createKnexInstance(options: KnexConnectionOptions): Knex {
  return knex({
    client: 'mysql2',
    connection: {
      host: options.host,
      port: options.port,
      user: options.user,
      password: options.password,
      database: options.database,
      charset: 'utf8mb4',
    },
    pool: {
      min: 2,
      max: 10,
    },
  });
}
