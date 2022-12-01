import { DiskStore } from '@src/disk-store'
import { mapAsync } from 'iterable-operator'
import { IKeyAsyncConverter, IValueAsyncConverter } from '@src/types'

export class DiskStoreAsyncView<K, V> {
  constructor(
    private store: DiskStore
  , private keyConverter: IKeyAsyncConverter<K>
  , private valueConverter: IValueAsyncConverter<V>
  ) {}

  async has(key: K): Promise<boolean> {
    return this.store.has(await this.keyConverter.toString(key))
  }

  async get(key: K): Promise<V | undefined> {
    const buffer = this.store.get(await this.keyConverter.toString(key))

    if (buffer) {
      return await this.valueConverter.fromBuffer(buffer)
    } else {
      return undefined
    }
  }

  async set(key: K, value: V): Promise<void> {
    this.store.set(
      await this.keyConverter.toString(key)
    , await this.valueConverter.toBuffer(value)
    )
  }

  async delete(key: K): Promise<void> {
    this.store.delete(await this.keyConverter.toString(key))
  }

  clear(): void {
    this.store.clear()
  }

  keys(): AsyncIterable<K> {
    return mapAsync(
      this.store.keys()
    , key => this.keyConverter.fromString(key)
    )
  }
}
