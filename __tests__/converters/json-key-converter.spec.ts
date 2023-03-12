import { JSONKeyConverter } from '@converters/json-key-converter.js'

describe('JSONKeyConverter', () => {
  test('toString & fromString', () => {
    const converter = new JSONKeyConverter()

    const buffer = converter.toString(['foo', 'bar'])
    const result = converter.fromString(buffer)

    expect(result).toStrictEqual(['foo', 'bar'])
  })

  test('toString', () => {
    const converter = new JSONKeyConverter()

    const result = converter.toString(['foo', 'bar'])

    expect(result).toStrictEqual(JSON.stringify(['foo', 'bar']))
  })

  test('fromString', () => {
    const converter = new JSONKeyConverter()

    const result = converter.fromString(JSON.stringify(['foo', 'bar']))

    expect(result).toStrictEqual(['foo', 'bar'])
  })
})
