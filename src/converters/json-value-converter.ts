import { IValueConverter } from '@src/types.js'

export class JSONValueConverter<T> implements IValueConverter<T> {
  constructor(private encoding: BufferEncoding = 'utf-8') {}

  fromBuffer(buffer: Buffer): T {
    return JSON.parse(buffer.toString(this.encoding))
  }

  toBuffer(value: T): Buffer {
    return Buffer.from(JSON.stringify(value), this.encoding)
  }
}
