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

  close(): void {
    this.store.close()
  }

  has(key: string): boolean {
    const result = this.cache.get(key)
    if (result === false) {
      return result
    } else if (isntUndefined(result)) {
      return true
    } else {
      const result = this.store.get(key)
      if (result) {
        this.cache.set(key, result)
        return true
      } else {
        this.cache.set(key, false)
        return false
      }
    }
  }

  get(key: string): Buffer | undefined {
    const result = this.cache.get(key)
    if (result === false) {
      return undefined
    } else if (isntUndefined(result)) {
      return result
    } else {
      const result = this.store.get(key)
      if (result) {
        this.cache.set(key, result)
        return result
      } else {
        this.cache.set(key, false)
        return result
      }
    }
  }

  set(key: string, value: Buffer): void {
    this.store.set(key, value)

    this.cache.delete(key)
  }

  delete(key: string): void {
    this.store.delete(key)

    this.cache.delete(key)
  }

  clear(): void {
    this.store.clear()

    this.cache.clear()
  }

  keys(): IterableIterator<string> {
    return this.store.keys()
  }
}
