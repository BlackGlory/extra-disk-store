import { isBoolean } from '@blackglory/prelude'
import { DiskStore } from './disk-store'

export interface ICache {
  set(key: string, value: Buffer | boolean | undefined): void
  get(key: string): Buffer | boolean | undefined
  delete(key: string): void
  clear(): void
}

export enum CacheKeyType {
  Exist
, Value
}

export class DiskStoreWithCache {
  constructor(
    private store: DiskStore
  , private cache: ICache
  ) {}

  async close(): Promise<void> {
    await this.store.close()
  }

  has(key: string): boolean {
    const cacheKey = createCacheKey(CacheKeyType.Exist, key)
    const result = this.cache.get(cacheKey)
    if (isBoolean(result)) {
      return result
    } else {
      const result = this.store.has(key)
      this.cache.set(cacheKey, result)
      return result
    }
  }

  get(key: string): Buffer | undefined {
    const cacheKey = createCacheKey(CacheKeyType.Value, key)
    const result = this.cache.get(cacheKey)
    if (result instanceof Buffer) {
      return result
    } else {
      const result = this.store.get(key)
      this.cache.set(cacheKey, result)
      return result
    }
  }

  async set(key: string, value: Buffer): Promise<void> {
    await this.store.set(key, value)

    this.cache.delete(createCacheKey(CacheKeyType.Value, key))
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key)

    this.cache.delete(createCacheKey(CacheKeyType.Exist, key))
    this.cache.delete(createCacheKey(CacheKeyType.Value, key))
  }

  async clear(): Promise<void> {
    await this.store.clear()

    this.cache.clear()
  }

  keys(): IterableIterator<string> {
    return this.store.keys()
  }
}

export function createCacheKey(type: CacheKeyType, key: string): string {
  return JSON.stringify([type, key])
}
