import { PassthroughValueConverter } from '@converters/passthrough-value-converter'

describe('PassthroughValueConverter', () => {
  test('toBuffer & fromBuffer', () => {
    const converter = new PassthroughValueConverter()

    const str = converter.toBuffer(Buffer.from('foo'))
    const result = converter.fromBuffer(str)

    expect(result).toStrictEqual(Buffer.from('foo'))
  })

  test('toBuffer', () => {
    const converter = new PassthroughValueConverter()

    const result = converter.toBuffer(Buffer.from('foo'))

    expect(result).toStrictEqual(Buffer.from('foo'))
  })

  test('fromBuffer', () => {
    const converter = new PassthroughValueConverter()

    const result = converter.fromBuffer(Buffer.from('foo'))

    expect(result).toStrictEqual(Buffer.from('foo'))
  })
})
