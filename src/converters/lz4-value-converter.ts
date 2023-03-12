import * as lz4 from 'lz4-wasm-nodejs'
import { IValueConverter } from '@src/types.js'

export class LZ4ValueConverter<T> implements IValueConverter<T> {
  constructor(
    private valueConverter: IValueConverter<T>
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
