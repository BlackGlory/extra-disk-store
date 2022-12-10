import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import {
  DiskStoreWithCache
, createCacheKey
, CacheKeyType
} from '@src/disk-store-with-cache'
import { toArray } from '@blackglory/prelude'
import '@blackglory/jest-matchers'

describe('DiskStoreWithCache', () => {
  describe('has', () => {
    test('item exists', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      await setRawItem(baseStore, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.has('key')

      expect(result).toBe(true)
      expect(cache.size).toBe(1)
      expect(cache.get(createCacheKey(CacheKeyType.Exist, 'key'))).toBe(true)
    })

    test('item does not exist', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.has('key')

      expect(result).toBe(false)
      expect(cache.size).toBe(1)
      expect(cache.get(createCacheKey(CacheKeyType.Exist, 'key'))).toBe(false)
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const value = Buffer.from('value')
      const cache = new Map()
      cache.set(createCacheKey(CacheKeyType.Value, 'key'), value)
      const baseStore = new DiskStore()
      await setRawItem(baseStore, {
        key: 'key'
      , value
      })
      const store = new DiskStoreWithCache(baseStore, cache)

      await setRawItem(baseStore, {
        key: 'key'
      , value: Buffer.from('new-value')
      })
      const result = store.get('key')

      expect(result).toStrictEqual(value)
      expect(cache.size).toBe(1)
      expect(cache.get(createCacheKey(CacheKeyType.Value, 'key'))).toBe(value)
    })

    test('item does not exist', () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.get('key')

      expect(result).toBeUndefined()
      expect(cache.size).toBe(1)
      expect(cache.get(createCacheKey(CacheKeyType.Value, 'key'))).toBe(undefined)
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const value = Buffer.from('value')
      const cache = new Map()
      cache.set(createCacheKey(CacheKeyType.Value, 'key'), value)
      const baseStore = new DiskStore()
      await setRawItem(baseStore, {
        key: 'key'
      , value
      })
      const store = new DiskStoreWithCache(baseStore, cache)

      const newValue = Buffer.from('new value')
      const result = await store.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(baseStore, 'key')).toEqual({
        key: 'key'
      , value: newValue
      })
      expect(cache.size).toBe(0)
    })

    test('data does not exist', async () => {
      const cache = new Map()
      cache.set(createCacheKey(CacheKeyType.Value, 'key'), Buffer.from('value'))
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)

      const value = Buffer.from('value')
      const result = await store.set('key', value)

      expect(result).toBeUndefined()
      expect(getRawItem(baseStore, 'key')).toEqual({
        key: 'key'
      , value
      })
      expect(cache.size).toBe(0)
    })
  })

  test('delete', async () => {
    const cache = new Map()
    cache.set(createCacheKey(CacheKeyType.Exist, 'key'), Buffer.from('value'))
    const baseStore = new DiskStore()
    const value = Buffer.from('value')
    await setRawItem(baseStore, {
      key: 'key'
    , value
    })
    const store = new DiskStoreWithCache(baseStore, cache)

    const result = await store.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(baseStore, 'key')).toBeFalsy()
    expect(cache.size).toBe(0)
  })

  test('clear', async () => {
    const cache = new Map()
    cache.set(createCacheKey(CacheKeyType.Exist, 'key'), Buffer.from('value'))
    const baseStore = new DiskStore()
    await setRawItem(baseStore, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const store = new DiskStoreWithCache(baseStore, cache)

    const result = await store.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(baseStore, 'key')).toBeFalsy()
    expect(cache.size).toBe(0)
  })

  describe('keys', () => {
    test('general', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)
      try {
        await setRawItem(baseStore, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const iter = store.keys()
        const result = toArray(iter)

        expect(result).toStrictEqual(['key'])
      } finally {
        await store.close()
      }
    })

    test('edge: read while getting keys', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)
      try {
        await setRawItem(baseStore, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const iter = store.keys()
        const value = store.get('key')
        const result = iter.next()

        expect(value).toStrictEqual(Buffer.from('value'))
        expect(result).toStrictEqual({
          done: false
        , value: 'key'
        })
      } finally {
        await store.close()
      }
    })

    test('edge: write while getting keys', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)
      try {
        await setRawItem(baseStore, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const iter = store.keys()
        await store.set('key', Buffer.from('new-value'))
        const result = iter.next()

        expect(result).toStrictEqual({
          done: false
        , value: 'key'
        })
      } finally {
        await store.close()
      }
    })
  })

  describe('close', () => {
    test('create, close', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)

      await store.close()
    })

    test('create, set, close', async () => {
      const cache = new Map()
      const baseStore = new DiskStore()
      const store = new DiskStoreWithCache(baseStore, cache)

      try {
        await store.set('key', Buffer.from('value'))
      } finally {
        await store.close()
      }
    })
  })
})
