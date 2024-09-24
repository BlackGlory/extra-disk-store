import { describe, test, expect } from 'vitest'
import { IndexKeyConverter } from '@converters/index-key-converter.js'

describe('IndexKeyConverter', () => {
  test('toString & fromString', () => {
    const converter = new IndexKeyConverter()

    const str = converter.toString(100)
    const result = converter.fromString(str)

    expect(result).toBe(100)
  })

  test('toString', () => {
    const converter = new IndexKeyConverter(10)

    const result = converter.toString(100)

    expect(result).toBe('100')
  })

  test('fromString', () => {
    const converter = new IndexKeyConverter(10)

    const result = converter.fromString('100')

    expect(result).toBe(100)
  })
})
