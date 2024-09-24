import * as lz4 from 'lz4-wasm-nodejs'
import { IValueConverter, IValueAsyncConverter } from '@src/types.js'

export class LZ4ValueConverter<T> implements IValueConverter<T> {
  constructor(
    private valueConverter: IValueConverter<T>
  ) {}

  toBuffer(value: T): Buffer {
    const buffer = this.valueConverter.toBuffer(value)
    return Buffer.from(lz4.compress(buffer))
  }

  fromBuffer(value: Buffer): T {
    const buffer = Buffer.from(lz4.decompress(value))
    return this.valueConverter.fromBuffer(buffer)
  }
}

export class LZ4ValueAsyncConverter<T> implements IValueAsyncConverter<T> {
  constructor(
    private valueConverter: IValueConverter<T> | IValueAsyncConverter<T>
  ) {}

  async toBuffer(value: T): Promise<Buffer> {
    const buffer = await this.valueConverter.toBuffer(value)
    return Buffer.from(lz4.compress(buffer))
  }

  async fromBuffer(value: Buffer): Promise<T> {
    const buffer = Buffer.from(lz4.decompress(value))
    return await this.valueConverter.fromBuffer(buffer)
  }
}
