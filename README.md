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

const store = new DiskStore('/tmp/store')
await store.set('key', Buffer.from('value'))
const value = store.get('key')
```

## API
### DiskStore
```ts
class DiskStore {
  constructor(dirname: string)

  close(): Promise<void>

  has(key: string): boolean
  get(key: string): Buffer | undefined
  set(key: string, value: Buffer): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>

  keys(): IterableIterator<string>
}
```

### DiskStoreWithCache
```ts
interface ICache {
  set(key: string, value: Buffer | boolean | undefined): void
  get(key: string): Buffer | boolean | undefined
  delete(key: string): void
  clear(): void
}

class DiskStoreWithCache {
  constructor(
    store: DiskStore
  , cache: ICache
  )

  close(): Promise<void>

  has(key: string): Promise<boolean>
  get(key: string): Buffer | undefined
  set(key: string, value: Buffer): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>

  keys(): IterableIterator<string>
}
```

### DiskStoreView
```ts
interface IKeyConverter<T> {
  toString: (value: T) => Awaitable<string>
  fromString: (value: string) => Awaitable<T | undefined>
}

interface IValueConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}

class DiskStoreView<K, V> {
  constructor(
    store: DiskStore | DiskStoreWithCache
  , keyConverter: IKeyConverter<K>
  , valueConverter: IValueConverter<V>
  ) {}

  has(key: K): Promise<boolean>
  get(key: K): Promise<V | undefined> 
  set(key: K, value: V): Promise<void>
  delete(key: K): Promise<void>
  clear(): Promise<void>

  keys(): IterableIterator<K>
}
```

### Converters
#### IndexKeyConverter
```ts
class IndexKeyConverter implements IKeyConverter<number>
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

#### PassthroughKeyConverter
```ts
class PassthroughKeyConverter implements IKeyConverter<string>
```

#### PassthroughValueConverter
```ts
class PassthroughValueConverter implements IValueConverter<Buffer>
```

#### PrefixKeyConverter
```ts
class PrefixKeyConverter<T> implements IKeyConverter<T> {
  constructor(keyConverter: IKeyConverter<T>, prefix: string)
}
```

#### LZ4ValueConverter
```ts
class LZ4ValueConverter<T> implements IValueConverter<T> {
  constructor(valueConverter: IValueConverter<T>)
}
```

#### ZstandardValueConverter
```ts
class ZstandardValueConverter<T> implements IValueConverter<T> {
  static create<T>(
    valueConverter: IValueConverter<T>
  , level: number
  ): Promise<ZstandardValueConverter<T>>
}
```
