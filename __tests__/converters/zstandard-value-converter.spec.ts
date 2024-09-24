import { describe, test, expect } from 'vitest'
import { ZstandardValueAsyncConverter } from '@converters/zstandard-value-converter.js'
import { JSONValueConverter } from '@converters/json-value-converter.js'

describe('ZstandardValueAsyncConvertter', () => {
  test('toBuffer & fromBuffer', async () => {
    const converter = new ZstandardValueAsyncConverter(
      new JSONValueConverter()
    , 1
    )

    const buffer = await converter.toBuffer(['foo', 'bar'])
    const result = await converter.fromBuffer(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toBuffer', async () => {
    const converter = new ZstandardValueAsyncConverter(
      new JSONValueConverter()
    , 1
    )

    const result = await converter.toBuffer(['foo', 'bar'])

    expect(result).toStrictEqual(Buffer.from([
      40
    , 181
    , 47
    , 253
    , 0
    , 72
    , 105
    , 0
    , 0
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
    const converter = new ZstandardValueAsyncConverter(
      new JSONValueConverter()
    , 1
    )

    const result = await converter.fromBuffer(Buffer.from([
      40
    , 181
    , 47
    , 253
    , 32
    , 13
    , 105
    , 0
    , 0
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
