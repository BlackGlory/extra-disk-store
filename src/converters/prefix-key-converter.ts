import { IKeyConverter } from '@src/types'

export class PrefixKeyConverter<T> implements IKeyConverter<T> {
  constructor(
    private keyConverter: IKeyConverter<T>
  , private prefix: string
  ) {}

  async toString(value: T): Promise<string> {
    const key = await this.keyConverter.toString(value)
    return this.prefix + key
  }

  async fromString(value: string): Promise<T | undefined> {
    if (value.startsWith(this.prefix)) {
      const key = await this.keyConverter.fromString(value.slice(this.prefix.length))
      return key
    } else {
      return undefined
    }
  }
}
