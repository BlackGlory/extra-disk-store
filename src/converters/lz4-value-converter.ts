import * as lz4 from 'lz4-wasm-nodejs'
import { IValueConverter, IValueAsyncConverter } from '@src/types'

export class LZ4ValueConverter<T> implements IValueConverter<T>, IValueAsyncConverter<T> {
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
