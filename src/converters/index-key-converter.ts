import { IKeyConverter } from '@src/types.js'

export class IndexKeyConverter implements IKeyConverter<number> {
  constructor(private radix: number = 10) {}

  toString(value: number): string {
    return value.toString(this.radix)
  }

  fromString(value: string): number {
    return Number.parseInt(value, this.radix)
  }
}
