import { LZ4ValueConverter } from '@converters/lz4-value-converter'
import { JSONValueConverter } from '@converters/json-value-converter'

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
