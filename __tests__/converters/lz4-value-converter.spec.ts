import { describe, test, expect } from 'vitest'
import { LZ4ValueConverter, LZ4ValueAsyncConverter } from '@converters/lz4-value-converter.js'
import { JSONValueConverter } from '@converters/json-value-converter.js'

describe('LZ4ValueConvertter', () => {
  test('toBuffer & fromBuffer', () => {
    const converter = new LZ4ValueConverter(new JSONValueConverter())

    const buffer = converter.toBuffer(['foo', 'bar'])
    const result = converter.fromBuffer(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toBuffer', () => {
    const converter = new LZ4ValueConverter(new JSONValueConverter())

    const result = converter.toBuffer(['foo', 'bar'])

    expect(result).toStrictEqual(Buffer.from([
      13
    , 0
    , 0
    , 0
    , 208
    , 91
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
    const converter = new LZ4ValueConverter(new JSONValueConverter())

    const result = converter.fromBuffer(Buffer.from([
      13
    , 0
    , 0
    , 0
    , 208
    , 91
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

describe('LZ4ValueAsyncConvertter', () => {
  test('toBuffer & fromBuffer', async () => {
    const converter = new LZ4ValueAsyncConverter(new JSONValueConverter())

    const buffer = await converter.toBuffer(['foo', 'bar'])
    const result = await converter.fromBuffer(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toBuffer', async () => {
    const converter = new LZ4ValueAsyncConverter(new JSONValueConverter())

    const result = await converter.toBuffer(['foo', 'bar'])

    expect(result).toStrictEqual(Buffer.from([
      13
    , 0
    , 0
    , 0
    , 208
    , 91
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

  test('fromBuffer', async () => {
    const converter = new LZ4ValueAsyncConverter(new JSONValueConverter())

    const result = await converter.fromBuffer(Buffer.from([
      13
    , 0
    , 0
    , 0
    , 208
    , 91
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
