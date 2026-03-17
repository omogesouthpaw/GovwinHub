import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { Knex } from 'knex';
import { KnexConnectionOptions } from './datasource';
export declare const KNEX_CONNECTION = "KNEX_CONNECTION";
interface KnexModuleAsyncOptions {
    useFactory: (...args: any[]) => KnexConnectionOptions | Promise<KnexConnectionOptions>;
    inject?: any[];
}
export declare class KnexModule implements OnApplicationShutdown {
    private readonly knex;
    constructor(knex: Knex);
    static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule;
    onApplicationShutdown(): Promise<void>;
}
export {};
