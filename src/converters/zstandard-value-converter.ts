import * as zstd from '@mongodb-js/zstd'
import { IValueConverter, IValueAsyncConverter } from '@src/types.js'

export class ZstandardValueAsyncConverter<T> implements IValueAsyncConverter<T> {
  constructor(
    private valueConverter: IValueConverter<T> | IValueAsyncConverter<T>
  , private level: number
  ) {}

  async toBuffer(value: T): Promise<Buffer> {
    const buffer = await this.valueConverter.toBuffer(value)
    return Buffer.from(await zstd.compress(buffer, this.level))
  }

  async fromBuffer(value: Buffer): Promise<T> {
    const buffer = Buffer.from(await zstd.decompress(value))
    return await this.valueConverter.fromBuffer(buffer)
  }
}
