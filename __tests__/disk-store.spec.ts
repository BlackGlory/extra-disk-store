import { describe, test, expect } from 'vitest'
import { setRawItem, getRawItem, hasRawItem } from '@test/utils.js'
import { DiskStore } from '@src/disk-store.js'
import { toArray } from '@blackglory/prelude'

describe('DiskStore', () => {
  describe('has', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })

      const result = store.has('key')

      expect(result).toBe(true)
    })

    test('item does not exist', async () => {
      const store = await DiskStore.create()

      const result = store.has('key')

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      const value = Buffer.from('value')
      setRawItem(store, {
        key: 'key'
      , value
      })

      const result = store.get('key')

      expect(result).toStrictEqual(value)
    })

    test('item does not exist', async () => {
      const store = await DiskStore.create()

      const result = store.get('key')

      expect(result).toBeUndefined()
    })
  })

  describe('set', () => {
    test('item exists', async () => {
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

    test('item does not exist', async () => {
      const store = await DiskStore.create()
      const value = Buffer.from('value')
      const result = store.set('key', value)

      expect(result).toBeUndefined()
      expect(getRawItem(store, 'key')).toEqual({
        key: 'key'
      , value
      })
    })
  })

  test('delete', async () => {
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

  test('clear', async () => {
    const store = await DiskStore.create()
    setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })

    const result = store.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(store, 'key')).toBeFalsy()
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
