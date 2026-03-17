import { DynamicModule, Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Knex } from 'knex';
import { createKnexInstance, KnexConnectionOptions } from './datasource';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

interface KnexModuleAsyncOptions {
  useFactory: (...args: any[]) => KnexConnectionOptions | Promise<KnexConnectionOptions>;
  inject?: any[];
}

@Global()
@Module({})
export class KnexModule implements OnApplicationShutdown {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule {
    const knexProvider = {
      provide: KNEX_CONNECTION,
      useFactory: async (...args: any[]) => {
        const connectionOptions = await options.useFactory(...args);
        return createKnexInstance(connectionOptions);
      },
      inject: options.inject || [],
    };
    return {
      module: KnexModule,
      providers: [knexProvider],
      exports: [KNEX_CONNECTION],
    };
  }

  async onApplicationShutdown() {
    if (this.knex) {
      await this.knex.destroy();
    }
  }
}
