# extra-disk-store
A disk-based persistent store.

## Install
```sh
npm install --save extra-disk-store
# or
yarn add extra-disk-store
```

## Usage
```ts
import { DiskStore } from 'extra-disk-store'

const store = await DiskStore.create('/tmp/store')
store.set('key', Buffer.from('value'))
const value = store.get('key')
```

## API
### DiskStore
```ts
class DiskStore {
  static create(filename?: string): Promise<DiskStore>

  close(): void

  has(key: string): boolean
  get(key: string): {
    value: Buffer
    updatedAt: number
    timeToLive: number | null
  }
  set(key: string, value: Buffer): void
  delete(key: string): void
  clear(): void
  keys(): IterableIterator<string>
}
```

### DiskStoreView
```ts
interface IKeyConverter<T> {
  toString: (value: T) => string
  fromString: (value: string) => T | undefined
}

interface IValueConverter<T> {
  toBuffer: (value: T) => Buffer
  fromBuffer: (value: Buffer) => T
}

class DiskStoreView<K, V> {
  constructor(
    private store: DiskStore
  , private keyConverter: IKeyConverter<K>
  , private valueConverter: IValueConverter<V>
  )

  has(key: K): boolean
  get(key: K): V | undefined
  set(key: K, value: V): void
  clear(): void
  delete(key: K): void
  keys(): IterableIterator<K>
}
```

### DiskStoreAsyncView
```ts
interface IKeyAsyncConverter<T> {
  toString: (value: T) => Awaitable<string>
  fromString: (value: string) => Awaitable<T | undefined>
}

interface IValueAsyncConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}

class DiskStoreAsyncView<K, V> {
  constructor(
    store: DiskStore
  , keyConverter: IKeyAsyncConverter<K>
  , valueConverter: IValueAsyncConverter<V>
  )

  has(key: K): Promise<boolean>
  get(key: K): Promise<V | undefined>
  set(key: K, value: V): Promise<void>
  delete(key: K): Promise<void>
  clear(): void
  keys(): AsyncIterableIterator<K>
}
```

### Converters
#### PassthroughKeyConverter
```ts
class PassthroughKeyConverter implements IKeyConverter<string>, IKeyAsyncConverter<string>
```

#### PassthroughValueConverter
```ts
class PassthroughValueConverter implements IValueConverter<Buffer>, IValueAsyncConverter<Buffer>
```

#### IndexKeyConverter
```ts
class IndexKeyConverter implements IKeyConverter<number>, IKeyAsyncConverter<number> {
  constructor(radix: number = 10)
}
```

#### JSONKeyConverter
```ts
class JSONKeyConverter<T> implements IKeyConverter<T>, IKeyAsyncConverter<T>
```

#### JSONValueConverter
```ts
class JSONValueConverter<T> implements IValueConverter<T>, IValueAsyncConverter<T> {
  constructor(encoding: BufferEncoding = 'utf-8')
}
```

#### LZ4ValueConverter
```ts
class LZ4ValueConverter<T> implements IValueConverter<T>, IValueAsyncConverter<T> {
  constructor(valueConverter: IValueConverter<T>)
}
```

#### ZstandardValueConverter
```ts
class ZstandardValueConverter<T> implements IValueConverter<T>, IValueAsyncConverter<T> {
  static create<T>(
    valueConverter: IValueConverter<T>
  , level: number
  ): Promise<ZstandardValueConverter<T>>
}
```

#### PrefixKeyConverter
```ts
class PrefixKeyConverter<T> implements IKeyConverter<T>, IKeyAsyncConverter<T> {
  constructor(
    keyConverter: IKeyConverter<T>
  , prefix: string
  )

  toString(value: T): string
  fromString(value: string): T
}
```

#### PrefixKeyAsyncConverter
```ts
class PrefixKeyAsyncConverter<T> implements IKeyAsyncConverter<T> {
  constructor(
    keyConverter: IKeyConverter<T> | IKeyAsyncConverter<T>
  , prefix: string
  )

  toString(value: T): Promise<string>
  fromString(value: string): Promise<T>
}
```
