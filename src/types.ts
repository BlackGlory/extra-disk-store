import { Awaitable } from '@blackglory/prelude'

export interface IKeyConverter<T> {
  toString: (value: T) => string

  // `undefined`用于遍历key时的过滤.
  fromString: (value: string) => T | undefined
}

export interface IValueConverter<T> {
  toBuffer: (value: T) => Buffer
  fromBuffer: (value: Buffer) => T
}

export interface IKeyAsyncConverter<T> {
  toString: (value: T) => Awaitable<string>

  // `undefined`用于遍历key时的过滤.
  fromString: (value: string) => Awaitable<T | undefined>
}

export interface IValueAsyncConverter<T> {
  toBuffer: (value: T) => Awaitable<Buffer>
  fromBuffer: (value: Buffer) => Awaitable<T>
}
