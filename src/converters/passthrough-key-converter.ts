import { IKeyConverter, IKeyAsyncConverter } from '@src/types'

export class PassthroughKeyConverter implements IKeyConverter<string>, IKeyAsyncConverter<string> {
  toString(value: string): string {
    return value
  }

  fromString(value: string): string {
    return value
  }
}
