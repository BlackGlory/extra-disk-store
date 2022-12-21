import * as zstd from '@mongodb-js/zstd'
import { IValueConverter } from '@src/types'

export class ZstandardValueConverter<T> implements IValueConverter<T> {
  private constructor(
    private valueConverter: IValueConverter<T>
  , private level: number
  ) {}

  static async create<T>(
    valueConverter: IValueConverter<T>
  , level: number
  ): Promise<ZstandardValueConverter<T>> {
    return new ZstandardValueConverter(valueConverter, level)
  }

  async toBuffer(value: T): Promise<Buffer> {
    const buffer = await this.valueConverter.toBuffer(value)
    return Buffer.from(await zstd.compress(buffer, this.level))
  }

  async fromBuffer(value: Buffer): Promise<T> {
    const buffer = Buffer.from(await zstd.decompress(value))
    return await this.valueConverter.fromBuffer(buffer)
  }
}
