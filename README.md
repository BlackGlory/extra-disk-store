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
await store.set('key', Buffer.from('value'))
const value = store.get('key')?.toString()
```

## API
### DiskStore
```ts
class DiskStore {
  static create(filename?: string): Promise<DiskStore>

  close(): void

  has(key: string): boolean
  get(key: string): Buffer | undefined
  set(key: string, value: Buffer): void
  delete(key: string): void
  clear(): void

  keys(): IterableIterator<string>
}
```

### DiskStoreWithCache
```ts
interface ICache {
  set(key: string, value: Buffer | false): void
  get(key: string): Buffer | false | undefined
  delete(key: string): void
  clear(): void
}

class DiskStoreWithCache {
  constructor(store: DiskStore, cache: ICache)

  close(): void

  has(key: string): boolean
  get(key: string): Buffer | undefined
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
    store: DiskStore | DiskStoreWithCache
  , keyConverter: IKeyConverter<K>
  , valueConverter: IValueConverter<V>
  ) {}

  has(key: K): boolean
  get(key: K): V | undefined

  set(key: K, value: V): void

  delete(key: K): void
  clear(): void

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
    store: DiskStore | DiskStoreWithCache
  , keyConverter: IKeyAsyncConverter<K>
  , valueConverter: IValueAsyncConverter<V>
  ) {}

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
class PassthroughKeyConverter implements IKeyConverter<string>
```

#### PassthroughValueConverter
```ts
class PassthroughValueConverter implements IValueConverter<Buffer>
```

#### IndexKeyConverter
```ts
class IndexKeyConverter implements IKeyConverter<number>
```

#### PrefixKeyConverter
```ts
class PrefixKeyConverter<T> implements IKeyConverter<T> {
  constructor(keyConverter: IKeyConverter<T>, prefix: string)
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
  fromString(value: string): Promise<T | undefined>
}
```

#### JSONKeyConverter
```ts
class JSONKeyConverter<T> implements IKeyConverter<T>
```

#### JSONValueConverter
```ts
class JSONValueConverter<T> implements IValueConverter<T> {
  constructor(encoding: BufferEncoding = 'utf-8')
}
```

#### LZ4ValueConverter
```ts
class LZ4ValueConverter<T> implements IValueConverter<T> {
  constructor(valueConverter: IValueConverter<T>)
}
```

#### LZ4ValueAsyncConverter
```ts
class LZ4ValueAsyncConverter<T> implements IValueAsyncConverter<T> {
  constructor(valueConverter: IValueConverter<T> | IValueAsyncConverter<T>)

  toBuffer(value: T): Promise<Buffer>
  fromBuffer(value: Buffer): Promise<T>
}
```

#### ZstandardValueAsyncConverter
```ts
class ZstandardValueAsyncConverter<T> implements IValueAsyncConverter<T> {
  constructor(
    valueConverter: IValueConverter<T> | IValueAsyncConverter<T>
  , level: number
  )

  toBuffer(value: T): Promise<Buffer>
  fromBuffer(value: Buffer): Promise<T>
}
```
