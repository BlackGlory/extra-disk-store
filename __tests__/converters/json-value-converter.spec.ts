import { describe, test, expect } from 'vitest'
import { JSONValueConverter } from '@converters/json-value-converter.js'

describe('JSONValueConverter', () => {
  test('toBuffer & fromBuffer', () => {
    const converter = new JSONValueConverter('utf-8')

    const buffer = converter.toBuffer(['foo', 'bar'])
    const result = converter.fromBuffer(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toBuffer', () => {
    const converter = new JSONValueConverter('utf-8')

    const result = converter.toBuffer(['foo', 'bar'])

    expect(result).toStrictEqual(Buffer.from([
      91
    , 34
    , 102
    , 111
    , 111
    , 34
    , 44
    , 34
    , 98
    , 97
    , 114
    , 34
    , 93
    ]))
  })

  test('fromBuffer', () => {
    const converter = new JSONValueConverter('utf-8')

    const result = converter.fromBuffer(Buffer.from([
      91
    , 34
    , 102
    , 111
    , 111
    , 34
    , 44
    , 34
    , 98
    , 97
    , 114
    , 34
    , 93
    ]))

    expect(result).toStrictEqual(['foo', 'bar'])
  })
})
