import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import { toArray } from '@blackglory/prelude'
import '@blackglory/jest-matchers'

describe('DiskStore', () => {
  describe('has', () => {
    describe('item exists', () => {
      it('return true', async () => {
        const cache = await DiskStore.create()
        setRawItem(cache, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const result = cache.has('key')

        expect(result).toBe(true)
      })
    })

    describe('item does not exist', () => {
      it('return false', async () => {
        const cache = await DiskStore.create()

        const result = cache.has('key')

        expect(result).toBe(false)
      })
    })
  })

  describe('get', () => {
    describe('item exists', () => {
      it('return item', async () => {
        const cache = await DiskStore.create()
        const value = Buffer.from('value')
        setRawItem(cache, {
          key: 'key'
        , value
        })

        const result = cache.get('key')

        expect(result).toStrictEqual(value)
      })
    })

    describe('item does not exist', () => {
      it('return item', async () => {
        const cache = await DiskStore.create()

        const result = cache.get('key')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const cache = await DiskStore.create()
      const value = Buffer.from('value')
      setRawItem(cache, {
        key: 'key'
      , value
      })
      const newValue = Buffer.from('new value')

      const result = cache.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(cache, 'key')).toEqual({
        key: 'key'
      , value: newValue
      })
    })

    test('data does not exist', async () => {
      const cache = await DiskStore.create()
      const value = Buffer.from('value')
      const result = cache.set('key', value)

      expect(result).toBeUndefined()
      expect(getRawItem(cache, 'key')).toEqual({
        key: 'key'
      , value
      })
    })
  })

  test('delete', async () => {
    const cache = await DiskStore.create()
    const value = Buffer.from('value')
    setRawItem(cache, {
      key: 'key'
    , value
    })

    const result = cache.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(cache, 'key')).toBeFalsy()
  })

  test('clear', async () => {
    const cache = await DiskStore.create()
    setRawItem(cache, {
      key: 'key'
    , value: Buffer.from('value')
    })

    const result = cache.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(cache, 'key')).toBeFalsy()
  })

  test('keys', async () => {
    const cache = await DiskStore.create()
    setRawItem(cache, {
      key: 'key'
    , value: Buffer.from('value')
    })

    const iter = cache.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual(['key'])
  })

  describe('close', () => {
    test('create, close', async () => {
      const cache = await DiskStore.create()

      cache.close()
    })

    test('create, set, close', async () => {
      const cache = await DiskStore.create()
      cache.set('key', Buffer.from('value'))

      cache.close()
    })
  })
})
