import { describe, test, expect } from 'vitest'
import { setRawItem, getRawItem, hasRawItem } from '@test/utils.js'
import { DiskStore } from '@src/disk-store.js'
import { DiskStoreAsyncView } from '@src/disk-store-async-view.js'
import { toArrayAsync } from '@blackglory/prelude'
import { delay } from 'extra-promise'
import { PassthroughKeyConverter, PrefixKeyConverter } from '@src/converters/index.js'

describe('DiskStoreAsyncView', () => {
  describe('has', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      try {
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = await view.has('key')

        expect(result).toBe(true)
      } finally {
        store.close()
      }
    })

    test('item does not exist', async () => {
      const store = await DiskStore.create()
      try {
        const view = createView(store)

        const result = await view.has('key')

        expect(result).toBe(false)
      } finally {
        store.close()
      }
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      try {
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = await view.get('key')

        expect(result).toStrictEqual('value')
      } finally {
        store.close()
      }
    })

    test('item does not exist', async () => {
      const store = await DiskStore.create()
      try {
        const view = createView(store)

        const result = await view.get('key')

        expect(result).toBeUndefined()
      } finally {
        store.close()
      }
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      try {
        setRawItem(store, {
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
      } finally {
        store.close()
      }
    })

    test('data does not exist', async () => {
      const store = await DiskStore.create()
      try {
        const view = createView(store)

        const result = await view.set('key', 'value')

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value: Buffer.from('value')
        })
      } finally {
        store.close()
      }
    })
  })

  test('delete', async () => {
    const store = await DiskStore.create()
    try {
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = await view.delete('key')

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    } finally {
      store.close()
    }
  })

  test('clear', async () => {
    const store = await DiskStore.create()
    try {
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = view.clear()

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    } finally {
      store.close()
    }
  })

  describe('keys', () => {
    test('non-undefined', async () => {
      const store = await DiskStore.create()
      try {
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const iter = view.keys()
        const result = await toArrayAsync(iter)

        expect(result).toStrictEqual(['key'])
      } finally {
        store.close()
      }
    })

    test('undefined', async () => {
      const store = await DiskStore.create()
      try {
        setRawItem(store, {
          key: 'non-prefix-key'
        , value: Buffer.from('value')
        })
        setRawItem(store, {
          key: 'prefix-key'
        , value: Buffer.from('value')
        })
        const view = createViewWithPrefix(store, 'prefix-')

        const iter = view.keys()
        const result = await toArrayAsync(iter)

        expect(result).toStrictEqual(['key'])
      } finally {
        store.close()
      }
    })
  })
})

function createViewWithPrefix(
  store: DiskStore
, prefix: string
): DiskStoreAsyncView<string, string> {
  return new DiskStoreAsyncView<string, string>(
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

function createView(store: DiskStore): DiskStoreAsyncView<string, string> {
  return new DiskStoreAsyncView<string, string>(
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
