import { DiskStore } from '@src/disk-store.js'
import { DiskStoreWithCache } from '@src/disk-store-with-cache.js'
import { pipe } from 'extra-utils'
import { mapAsync, filterAsync } from 'iterable-operator'
import { Awaitable, isntUndefined } from '@blackglory/prelude'

export interface IKeyConverter<T> {
  toString: (value: T) => Awaitable<string>
  fromString: (value: string) => Awaitable<T | undefined>
}

export interface IValueConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}

export class DiskStoreView<K, V> {
  constructor(
    private store: DiskStore | DiskStoreWithCache
  , private keyConverter: IKeyConverter<K>
  , private valueConverter: IValueConverter<V>
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
    await this.store.set(
      ...await Promise.all([
        await this.keyConverter.toString(key)
      , await this.valueConverter.toBuffer(value)
      ])
    )
  }

  async delete(key: K): Promise<void> {
    await this.store.delete(await this.keyConverter.toString(key))
  }

  async clear(): Promise<void> {
    await this.store.clear()
  }

  keys(): AsyncIterableIterator<K> {
    return pipe(
      this.store.keys()
    , iter => mapAsync(iter, async key => await this.keyConverter.fromString(key))
    , iter => filterAsync(iter, isntUndefined)
    )
  }
}
