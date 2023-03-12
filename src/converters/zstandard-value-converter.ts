import * as zstd from '@mongodb-js/zstd'
import { IValueConverter } from '@src/types.js'

export class ZstandardValueConverter<T> implements IValueConverter<T> {
  constructor(
    private valueConverter: IValueConverter<T>
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
