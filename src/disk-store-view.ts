import { DiskStore } from '@src/disk-store.js'
import { DiskStoreWithCache } from '@src/disk-store-with-cache.js'
import { pipe } from 'extra-utils'
import { map, filter } from 'iterable-operator'
import { isntUndefined } from '@blackglory/prelude'
import { IKeyConverter, IValueConverter } from './types.js'

export class DiskStoreView<K, V> {
  constructor(
    private store: DiskStore | DiskStoreWithCache
  , private keyConverter: IKeyConverter<K>
  , private valueConverter: IValueConverter<V>
  ) {}

  has(key: K): boolean {
    return this.store.has(this.keyConverter.toString(key))
  }

  get(key: K): V | undefined {
    const buffer = this.store.get(this.keyConverter.toString(key))

    if (buffer) {
      return this.valueConverter.fromBuffer(buffer)
    } else {
      return undefined
    }
  }

  set(key: K, value: V): void {
    this.store.set(
      this.keyConverter.toString(key)
    , this.valueConverter.toBuffer(value)
    )
  }

  delete(key: K): void {
    this.store.delete(this.keyConverter.toString(key))
  }

  clear(): void {
    this.store.clear()
  }

  keys(): IterableIterator<K> {
    return pipe(
      this.store.keys()
    , iter => map(iter, key => this.keyConverter.fromString(key))
    , iter => filter<K | undefined, K>(iter, isntUndefined)
    )
  }
}
