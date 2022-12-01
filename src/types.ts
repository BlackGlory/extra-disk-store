import { Awaitable } from '@blackglory/prelude'

export interface IKeyConverter<T> {
  toString: (value: T) => string
  fromString: (value: string) => T
}

export interface IValueConverter<T> {
  toBuffer: (value: T) => Buffer
  fromBuffer: (value: Buffer) => T
}

export interface IKeyAsyncConverter<T> {
  toString: (value: T) => Awaitable<string>
  fromString: (value: string) => Awaitable<T>
}

export interface IValueAsyncConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}
