import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import type { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

const redisCacheOptions: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const redisHost = configService.get<string>('config.redisHost');

    if (!redisHost) {
      // Fallback to in-memory cache for local dev
      return { ttl: 60_000 };
    }

    return {
      store: await redisStore({
        socket: {
          host: redisHost,
          port: configService.get<number>('config.redisPort', 6379),
        },
        password: configService.get<string>('config.redisPassword'),
        ttl: 60_000,
      }),
    };
  },
};

@Global()
@Module({
  imports: [CacheModule.registerAsync(redisCacheOptions)],
  exports: [CacheModule],
})
export class RedisModule {}
