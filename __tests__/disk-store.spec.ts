import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore, CacheKeyType, createCacheKey } from '@src/disk-store'
import { toArray } from '@blackglory/prelude'
import '@blackglory/jest-matchers'

describe('DiskStore', () => {
  describe('has', () => {
    describe('item exists', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const result = store.has('key')

        expect(result).toBe(true)
      })

      test('with cache', async () => {
        const cache = new Map()
        const store = await DiskStore.create(undefined, cache)
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const result = store.has('key')

        expect(result).toBe(true)
        expect(cache.size).toBe(1)
        expect(cache.get(createCacheKey(CacheKeyType.Exist, 'key'))).toBe(true)
      })
    })

    describe('item does not exist', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()

        const result = store.has('key')

        expect(result).toBe(false)
      })

      test('with cache', async () => {
        const cache = new Map()
        const store = await DiskStore.create(undefined, cache)

        const result = store.has('key')

        expect(result).toBe(false)
        expect(cache.size).toBe(1)
        expect(cache.get(createCacheKey(CacheKeyType.Exist, 'key'))).toBe(false)
      })
    })
  })

  describe('get', () => {
    describe('item exists', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()
        const value = Buffer.from('value')
        setRawItem(store, {
          key: 'key'
        , value
        })

        const result = store.get('key')

        expect(result).toStrictEqual(value)
      })

      test('with cache', async () => {
        const value = Buffer.from('value')
        const cache = new Map()
        cache.set(createCacheKey(CacheKeyType.Value, 'key'), value)
        const store = await DiskStore.create(undefined, cache)
        setRawItem(store, {
          key: 'key'
        , value
        })

        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('new-value')
        })
        const result = store.get('key')

        expect(result).toStrictEqual(value)
        expect(cache.size).toBe(1)
        expect(cache.get(createCacheKey(CacheKeyType.Value, 'key'))).toBe(value)
      })
    })

    describe('item does not exist', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()

        const result = store.get('key')

        expect(result).toBeUndefined()
      })

      test('with cache', async () => {
        const cache = new Map()
        const store = await DiskStore.create(undefined, cache)

        const result = store.get('key')

        expect(result).toBeUndefined()
        expect(cache.size).toBe(1)
        expect(cache.get(createCacheKey(CacheKeyType.Value, 'key'))).toBe(undefined)
      })
    })
  })

  describe('set', () => {
    describe('item exists', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()
        const value = Buffer.from('value')
        setRawItem(store, {
          key: 'key'
        , value
        })
        const newValue = Buffer.from('new value')

        const result = store.set('key', newValue)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value: newValue
        })
      })

      test('with cache', async () => {
        const value = Buffer.from('value')
        const cache = new Map()
        cache.set(createCacheKey(CacheKeyType.Value, 'key'), value)
        const store = await DiskStore.create(undefined, cache)
        setRawItem(store, {
          key: 'key'
        , value
        })

        const newValue = Buffer.from('new value')
        const result = store.set('key', newValue)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value: newValue
        })
        expect(cache.size).toBe(0)
      })
    })

    describe('data does not exist', () => {
      test('without cache', async () => {
        const store = await DiskStore.create()
        const value = Buffer.from('value')
        const result = store.set('key', value)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value
        })
      })

      test('with cache', async () => {
        const cache = new Map()
        cache.set(createCacheKey(CacheKeyType.Value, 'key'), Buffer.from('value'))
        const store = await DiskStore.create(undefined, cache)

        const value = Buffer.from('value')
        const result = store.set('key', value)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value
        })
        expect(cache.size).toBe(0)
      })
    })
  })

  describe('delete', () => {
    test('without cache', async () => {
      const store = await DiskStore.create()
      const value = Buffer.from('value')
      setRawItem(store, {
        key: 'key'
      , value
      })

      const result = store.delete('key')

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    })

    test('with cache', async () => {
      const cache = new Map()
      cache.set(createCacheKey(CacheKeyType.Exist, 'key'), Buffer.from('value'))
      const store = await DiskStore.create(undefined, cache)
      const value = Buffer.from('value')
      setRawItem(store, {
        key: 'key'
      , value
      })

      const result = store.delete('key')

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
      expect(cache.size).toBe(0)
    })
  })

  describe('clear', () => {
    test('without cache', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const result = store.clear()

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    })

    test('with cache', async () => {
      const cache = new Map()
      cache.set(createCacheKey(CacheKeyType.Exist, 'key'), Buffer.from('value'))
      const store = await DiskStore.create(undefined, cache)
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const result = store.clear()

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
      expect(cache.size).toBe(0)
    })
  })

  describe('keys', () => {
    test('general', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const iter = store.keys()
      const result = toArray(iter)

      expect(result).toStrictEqual(['key'])
    })

    test('edge: read while getting keys', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const iter = store.keys()
      const key = store.get('key')
      const result = iter.next()

      expect(key).toStrictEqual(Buffer.from('value'))
      expect(result).toStrictEqual({
        done: false
      , value: 'key'
      })
    })

    test('edge: write while getting keys', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const iter = store.keys()
      store.set('key', Buffer.from('new-value'))
      const result = iter.next()

      expect(result).toStrictEqual({
        done: false
      , value: 'key'
      })
    })
  })

  describe('close', () => {
    test('create, close', async () => {
      const store = await DiskStore.create()

      store.close()
    })

    test('create, set, close', async () => {
      const store = await DiskStore.create()
      store.set('key', Buffer.from('value'))

      store.close()
    })
  })
})
