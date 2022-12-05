import { IKeyConverter, IKeyAsyncConverter } from '@src/types'
import { assert } from '@blackglory/prelude'

export class PrefixKeyConverter<T> implements IKeyConverter<T>, IKeyAsyncConverter<T> {
  constructor(
    private keyConverter: IKeyConverter<T>
  , private prefix: string
  ) {}

  toString(value: T): string {
    const key = this.keyConverter.toString(value)
    return this.prefix + key
  }

  fromString(value: string): T {
    assert(value.startsWith(this.prefix), 'The key does not start with prefix')

    const key = this.keyConverter.fromString(value.slice(this.prefix.length))
    return key
  }
}

export class PrefixKeyAsyncConverter<T> implements IKeyAsyncConverter<T> {
  constructor(
    private keyConverter: IKeyConverter<T> | IKeyAsyncConverter<T>
  , private prefix: string
  ) {}

  async toString(value: T): Promise<string> {
    const key = await this.keyConverter.toString(value)
    return this.prefix + key
  }

  async fromString(value: string): Promise<T> {
    assert(value.startsWith(this.prefix), 'The key does not start with prefix')

    const key = await this.keyConverter.fromString(value.slice(this.prefix.length))
    return key
  }
}
