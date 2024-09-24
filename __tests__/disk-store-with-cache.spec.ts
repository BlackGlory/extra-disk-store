import { describe, test, expect } from 'vitest'
import { setRawItem, getRawItem, hasRawItem } from '@test/utils.js'
import { DiskStore } from '@src/disk-store.js'
import { DiskStoreWithCache } from '@src/disk-store-with-cache.js'
import { toArray } from '@blackglory/prelude'

describe('DiskStoreWithCache', () => {
  describe('has', () => {
    test('item exists', async () => {
      const baseStore = await DiskStore.create()
      setRawItem(baseStore, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.has('key')

      expect(result).toBe(true)
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toStrictEqual(Buffer.from('value'))
    })

    test('item does not exist', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.has('key')

      expect(result).toBe(false)
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toBe(false)
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const baseStore = await DiskStore.create()
      const value = Buffer.from('value')
      const cache = new Map()
      cache.set('key', value)
      setRawItem(baseStore, {
        key: 'key'
      , value
      })
      const store = new DiskStoreWithCache(baseStore, cache)

      setRawItem(baseStore, {
        key: 'key'
      , value: Buffer.from('new-value')
      })
      const result = store.get('key')

      expect(result).toStrictEqual(value)
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toBe(value)
    })

    test('item does not exist', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)

      const result = store.get('key')

      expect(result).toBeUndefined()
      expect(cache.size).toBe(1)
      expect(cache.get('key')).toBe(false)
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const baseStore = await DiskStore.create()
      const value = Buffer.from('value')
      const cache = new Map()
      cache.set('key', value)
      setRawItem(baseStore, {
        key: 'key'
      , value
      })
      const store = new DiskStoreWithCache(baseStore, cache)

      const newValue = Buffer.from('new value')
      const result = store.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(baseStore, 'key')).toEqual({
        key: 'key'
      , value: newValue
      })
      expect(cache.size).toBe(0)
    })

    test('data does not exist', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      cache.set('key', Buffer.from('value'))
      const store = new DiskStoreWithCache(baseStore, cache)

      const value = Buffer.from('value')
      const result = store.set('key', value)

      expect(result).toBeUndefined()
      expect(getRawItem(baseStore, 'key')).toEqual({
        key: 'key'
      , value
      })
      expect(cache.size).toBe(0)
    })
  })

  test('delete', async () => {
    const baseStore = await DiskStore.create()
    const cache = new Map()
    cache.set('key', Buffer.from('value'))
    const value = Buffer.from('value')
    setRawItem(baseStore, {
      key: 'key'
    , value
    })
    const store = new DiskStoreWithCache(baseStore, cache)

    const result = store.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(baseStore, 'key')).toBeFalsy()
    expect(cache.size).toBe(0)
  })

  test('clear', async () => {
    const baseStore = await DiskStore.create()
    const cache = new Map()
    cache.set('key', Buffer.from('value'))
    setRawItem(baseStore, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const store = new DiskStoreWithCache(baseStore, cache)

    const result = store.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(baseStore, 'key')).toBeFalsy()
    expect(cache.size).toBe(0)
  })

  describe('keys', () => {
    test('general', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)
      setRawItem(baseStore, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const iter = store.keys()
      const result = toArray(iter)

      expect(result).toStrictEqual(['key'])
    })

    test('edge: read while getting keys', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)
      setRawItem(baseStore, {
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
    })

    test('edge: write while getting keys', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)
      setRawItem(baseStore, {
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
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)

      store.close()
    })

    test('create, set, close', async () => {
      const baseStore = await DiskStore.create()
      const cache = new Map()
      const store = new DiskStoreWithCache(baseStore, cache)

      store.set('key', Buffer.from('value'))

      store.close()
    })
  })
})
