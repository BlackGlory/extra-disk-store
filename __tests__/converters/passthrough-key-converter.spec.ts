import { describe, test, expect } from 'vitest'
import { PassthroughKeyConverter } from '@converters/passthrough-key-converter.js'

describe('PassthroughKeyConverter', () => {
  test('toString & fromString', () => {
    const converter = new PassthroughKeyConverter()

    const str = converter.toString('foo')
    const result = converter.fromString(str)

    expect(result).toBe('foo')
  })

  test('toString', () => {
    const converter = new PassthroughKeyConverter()

    const result = converter.toString('foo')

    expect(result).toBe('foo')
  })

  test('fromString', () => {
    const converter = new PassthroughKeyConverter()

    const result = converter.fromString('foo')

    expect(result).toBe('foo')
  })
})
