import { IKeyConverter } from '@src/types'

export class JSONKeyConverter<T> implements IKeyConverter<T> {
  fromString(value: string): T {
    return JSON.parse(value)
  }

  toString(value: T): string {
    return JSON.stringify(value)
  }
}
