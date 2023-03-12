import { isntUndefined } from '@blackglory/prelude'
import { DiskStore } from './disk-store.js'

export interface ICache {
  set(key: string, value: Buffer | false): void
  get(key: string): Buffer | false | undefined
  delete(key: string): void
  clear(): void
}

export class DiskStoreWithCache {
  constructor(
    private store: DiskStore
  , private cache: ICache
  ) {}

  async close(): Promise<void> {
    await this.store.close()
  }

  async has(key: string): Promise<boolean> {
    const result = this.cache.get(key)
    if (result === false) {
      return result
    } else if (isntUndefined(result)) {
      return true
    } else {
      const result = await this.store.get(key)
      if (result) {
        this.cache.set(key, result)
        return true
      } else {
        this.cache.set(key, false)
        return false
      }
    }
  }

  async get(key: string): Promise<Buffer | undefined> {
    const result = this.cache.get(key)
    if (result === false) {
      return undefined
    } else if (isntUndefined(result)) {
      return result
    } else {
      const result = await this.store.get(key)
      if (result) {
        this.cache.set(key, result)
        return result
      } else {
        this.cache.set(key, false)
        return result
      }
    }
  }

  async set(key: string, value: Buffer): Promise<void> {
    await this.store.set(key, value)

    this.cache.delete(key)
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key)

    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    await this.store.clear()

    this.cache.clear()
  }
}
