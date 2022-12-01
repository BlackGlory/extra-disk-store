import { IValueConverter, IValueAsyncConverter } from '@src/types'

export class PassthroughValueConverter implements IValueConverter<Buffer>, IValueAsyncConverter<Buffer> {
  toBuffer(value: Buffer): Buffer {
    return value
  }

  fromBuffer(value: Buffer): Buffer {
    return value
  }
}
