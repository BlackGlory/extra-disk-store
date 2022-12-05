import { PrefixKeyConverter, PrefixKeyAsyncConverter } from '@converters/prefix-key-converter'
import { PassthroughKeyConverter } from '@converters/passthrough-key-converter'

describe('PrefixKeyConverter', () => {
  test('toString & fromString', () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const str = converter.toString('foo')
    const result = converter.fromString(str)

    expect(result).toBe('foo')
  })

  test('toString', () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = converter.toString('foo')

    expect(result).toBe('prefix-foo')
  })

  test('fromString', () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = converter.fromString('prefix-foo')

    expect(result).toBe('foo')
  })
})

describe('PrefixAsyncConverter', () => {
  test('toString & fromString', async () => {
    const converter = new PrefixKeyAsyncConverter(new PassthroughKeyConverter(), 'prefix-')

    const str = await converter.toString('foo')
    const result = await converter.fromString(str)

    expect(result).toBe('foo')
  })

  test('toString', async () => {
    const converter = new PrefixKeyAsyncConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = await converter.toString('foo')

    expect(result).toBe('prefix-foo')
  })

  test('fromString', async () => {
    const converter = new PrefixKeyAsyncConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = await converter.fromString('prefix-foo')

    expect(result).toBe('foo')
  })
})
