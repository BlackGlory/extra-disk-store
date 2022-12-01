import { ZstandardValueConverter } from '@converters/zstandard-value-converter'
import { JSONValueConverter } from '@converters/json-value-converter'

describe('ZstandardValueConvertter', () => {
  test('toBuffer & fromBuffer', async () => {
    const converter = await ZstandardValueConverter.create(new JSONValueConverter(), 1)

    const buffer = converter.toBuffer(['foo', 'bar'])
    const result = converter.fromBuffer(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toBuffer', async () => {
    const converter = await ZstandardValueConverter.create(new JSONValueConverter(), 1)

    const result = converter.toBuffer(['foo', 'bar'])

    expect(result).toStrictEqual(Buffer.from([
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
  })

  test('fromBuffer', async () => {
    const converter = await ZstandardValueConverter.create(new JSONValueConverter(), 1)

    const result = converter.fromBuffer(Buffer.from([
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
