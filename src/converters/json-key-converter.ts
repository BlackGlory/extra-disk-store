import { IKeyConverter } from '@src/types.js'
import { getResult } from 'return-style'

export class JSONKeyConverter<T> implements IKeyConverter<T> {
  toString(value: T): string {
    return JSON.stringify(value)
  }

  fromString(value: string): T | undefined {
    return getResult(() => JSON.parse(value))
  }
}
