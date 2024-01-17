import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const TIME_TO_LIVE = 60; // 60s

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(
    key: string,
    defaultValue: T = undefined,
  ): Promise<T | undefined> {
    const result = await this.cacheManager.get<T>(key);

    if (result === undefined || result === null) {
      return defaultValue;
    }

    return result;
  }

  async set<T>(key: string, value: T, ttl = TIME_TO_LIVE): Promise<T> {
    const result = await this.cacheManager.set<T>(key, value, {
      ttl,
    });

    return result;
  }

  async forever<T>(key: string, value: T): Promise<T> {
    const result = await this.cacheManager.set<T>(key, value, { ttl: 0 });

    return result;
  }

  async remember<T>(
    key: string,
    ttl = TIME_TO_LIVE,
    dataFunction: () => T,
  ): Promise<T> {
    const exits = await this.get<T>(key);

    if (exits !== undefined && exits !== null) {
      return exits;
    } else {
      const dataToCache = await dataFunction();

      await this.set(key, dataToCache, ttl);

      return dataToCache;
    }
  }

  async rememberForever<T>(key: string, dataFunction: () => T): Promise<T> {
    const exits = await this.get<T>(key);

    if (exits !== undefined && exits !== null) {
      return exits;
    } else {
      const dataToCache = await dataFunction();

      await this.forever(key, dataToCache);

      return dataToCache;
    }
  }

  async del(key: string): Promise<any> {
    const result = await this.cacheManager.del(key);

    return result;
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}
