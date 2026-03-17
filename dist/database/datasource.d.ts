import { Knex } from 'knex';
export interface KnexConnectionOptions {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
export declare function createKnexInstance(options: KnexConnectionOptions): Knex;
