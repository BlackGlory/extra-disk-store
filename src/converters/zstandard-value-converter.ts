import * as zstd from '@bokuweb/zstd-wasm'
import { IValueConverter, IValueAsyncConverter } from '@src/types'

export class ZstandardValueConverter<T> implements IValueConverter<T>, IValueAsyncConverter<T> {
  private constructor(
    private valueConverter: IValueConverter<T>
  , private level: number
  ) {}

  static async create<T>(
    valueConverter: IValueConverter<T>
  , level: number
  ): Promise<ZstandardValueConverter<T>> {
    await zstd.init()
    return new ZstandardValueConverter(valueConverter, level)
  }

  toBuffer(value: T): Buffer {
    const buffer = this.valueConverter.toBuffer(value)
    return Buffer.from(zstd.compress(buffer, this.level))
  }

  fromBuffer(value: Buffer): T {
    const buffer = Buffer.from(zstd.decompress(value))
    return this.valueConverter.fromBuffer(buffer)
  }
}
