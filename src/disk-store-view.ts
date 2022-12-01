import { DiskStore } from '@src/disk-store'
import { map } from 'iterable-operator'
import { IKeyConverter, IValueConverter } from '@src/types'

export class DiskStoreView<K, V> {
  constructor(
    private store: DiskStore
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

  keys(): Iterable<K> {
    return map(
      this.store.keys()
    , key => this.keyConverter.fromString(key)
    )
  }
}
