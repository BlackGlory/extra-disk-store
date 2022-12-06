import { Awaitable } from '@blackglory/prelude'

export interface ICache {
  set(key: string, value: Buffer | boolean | undefined): void
  get(key: string): Buffer | boolean | undefined
  delete(key: string): void
  clear(): void
}

export interface IKeyConverter<T> {
  toString: (value: T) => string
  fromString: (value: string) => T | undefined
}

export interface IValueConverter<T> {
  toBuffer: (value: T) => Buffer
  fromBuffer: (value: Buffer) => T
}

export interface IKeyAsyncConverter<T> {
  toString: (value: T) => Awaitable<string>
  fromString: (value: string) => Awaitable<T | undefined>
}

export interface IValueAsyncConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}
