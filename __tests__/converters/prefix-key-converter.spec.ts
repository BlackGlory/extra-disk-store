import { PrefixKeyConverter } from '@converters/prefix-key-converter.js'
import { PassthroughKeyConverter } from '@converters/passthrough-key-converter.js'

describe('PrefixKeyConverter', () => {
  test('toString & fromString', async () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const str = await converter.toString('foo')
    const result = await converter.fromString(str)

    expect(result).toBe('foo')
  })

  test('toString', async () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = await converter.toString('foo')

    expect(result).toBe('prefix-foo')
  })

  test('fromString', async () => {
    const converter = new PrefixKeyConverter(new PassthroughKeyConverter(), 'prefix-')

    const result = await converter.fromString('prefix-foo')

    expect(result).toBe('foo')
  })
})
