import { IKeyConverter } from '@src/types.js'

export class PassthroughKeyConverter implements IKeyConverter<string> {
  toString(value: string): string {
    return value
  }

  fromString(value: string): string {
    return value
  }
}
