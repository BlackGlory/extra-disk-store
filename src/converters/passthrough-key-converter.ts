import { IKeyConverter } from '@src/types'

export class PassthroughKeyConverter implements IKeyConverter<string> {
  toString(value: string): string {
    return value
  }

  fromString(value: string): string {
    return value
  }
}
