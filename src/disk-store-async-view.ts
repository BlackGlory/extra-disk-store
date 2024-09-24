import { DiskStore } from '@src/disk-store.js'
import { DiskStoreWithCache } from '@src/disk-store-with-cache.js'
import { pipe } from 'extra-utils'
import { mapAsync, filterAsync } from 'iterable-operator'
import { isntUndefined } from '@blackglory/prelude'
import { IKeyAsyncConverter, IValueAsyncConverter } from './types.js'

export class DiskStoreAsyncView<K, V> {
  constructor(
    private store: DiskStore | DiskStoreWithCache
  , private keyConverter: IKeyAsyncConverter<K>
  , private valueConverter: IValueAsyncConverter<V>
  ) {}

  async has(key: K): Promise<boolean> {
    return this.store.has(await this.keyConverter.toString(key))
  }

  async get(key: K): Promise<V | undefined> {
    const buffer = this.store.get(await this.keyConverter.toString(key))

    if (buffer) {
      return this.valueConverter.fromBuffer(buffer)
    } else {
      return undefined
    }
  }

  async set(key: K, value: V): Promise<void> {
    this.store.set(
      ...await Promise.all([
        await this.keyConverter.toString(key)
      , await this.valueConverter.toBuffer(value)
      ])
    )
  }

  async delete(key: K): Promise<void> {
    this.store.delete(await this.keyConverter.toString(key))
  }

  clear(): void {
    this.store.clear()
  }

  keys(): AsyncIterableIterator<K> {
    return pipe(
      this.store.keys()
    , iter => mapAsync(iter, key => this.keyConverter.fromString(key))
    , iter => filterAsync<Awaited<K> | undefined, Awaited<Awaited<K>>>(iter, isntUndefined)
    )
  }
}
