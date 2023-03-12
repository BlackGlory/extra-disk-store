import { IValueConverter } from '@src/types.js'

export class PassthroughValueConverter implements IValueConverter<Buffer> {
  toBuffer(value: Buffer): Buffer {
    return value
  }

  fromBuffer(value: Buffer): Buffer {
    return value
  }
}
