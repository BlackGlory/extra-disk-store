import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import { DiskStoreView } from '@src/disk-store-view'
import { toArrayAsync } from '@blackglory/prelude'
import { delay } from 'extra-promise'
import { PassthroughKeyConverter, PrefixKeyConverter } from '@src/converters'
import '@blackglory/jest-matchers'

describe('DiskStoreView', () => {
  describe('has', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = await view.has('key')

      expect(result).toBe(true)
    })

    test('item does not exist', async () => {
      const store = new DiskStore()
      const view = createView(store)

      const result = await view.has('key')

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = await view.get('key')

      expect(result).toStrictEqual('value')
    })

    test('item does not exist', async () => {
      const store = new DiskStore()
      const view = createView(store)

      const result = await view.get('key')

      expect(result).toBeUndefined()
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)
      const newValue = 'new value'

      const result = await view.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(store, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from(newValue)
      })
    })

    test('data does not exist', async () => {
      const store = new DiskStore()
      const view = createView(store)

      const result = await view.set('key', 'value')

      expect(result).toBeUndefined()
      expect(getRawItem(store, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from('value')
      })
    })
  })

  test('delete', async () => {
    const store = new DiskStore()
    await setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(store)

    const result = await view.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(store, 'key')).toBeFalsy()
  })

  test('clear', async () => {
    const store = new DiskStore()
    await setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(store)

    const result = await view.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(store, 'key')).toBeFalsy()
  })

  describe('keys', () => {
    test('non-undefined', async () => {
      const store = new DiskStore()
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const iter = view.keys()
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual(['key'])
    })

    test('undefined', async () => {
      const store = new DiskStore()
      await setRawItem(store, {
        key: 'non-prefix-key'
      , value: Buffer.from('value')
      })
      await setRawItem(store, {
        key: 'prefix-key'
      , value: Buffer.from('value')
      })
      const view = createViewWithPrefix(store, 'prefix-')

      const iter = view.keys()
      const result = await toArrayAsync(iter)

      expect(result).toStrictEqual(['key'])
    })
  })
})

function createViewWithPrefix(store: DiskStore, prefix: string): DiskStoreView<string, string> {
  return new DiskStoreView<string, string>(
    store
  , new PrefixKeyConverter(
      new PassthroughKeyConverter()
    , prefix
    )
  , { 
      fromBuffer: async x => {
        await delay(0)
        return x.toString()
      }
    , toBuffer: async x => {
        await delay(0)
        return Buffer.from(x)
      }
    }
  )
}

function createView(store: DiskStore): DiskStoreView<string, string> {
  return new DiskStoreView<string, string>(
    store
  , {
      toString: async x => {
        await delay(0)
        return x
      }
    , fromString: async x => {
        await delay(0)
        return x
      }
    }
  , { 
      fromBuffer: async x => {
        await delay(0)
        return x.toString()
      }
    , toBuffer: async x => {
        await delay(0)
        return Buffer.from(x)
      }
    }
  )
}
