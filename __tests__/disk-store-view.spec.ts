import { setRawItem, getRawItem, hasRawItem } from '@test/utils.js'
import { DiskStore } from '@src/disk-store.js'
import { DiskStoreView } from '@src/disk-store-view.js'
import { toArrayAsync } from '@blackglory/prelude'
import { delay } from 'extra-promise'
import { PassthroughKeyConverter, PrefixKeyConverter } from '@src/converters/index.js'

describe('DiskStoreView', () => {
  describe('has', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      try {
        await setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = await view.has('key')

        expect(result).toBe(true)
      } finally {
        await store.close()
      }
    })

    test('item does not exist', async () => {
      const store = new DiskStore()
      try {
        const view = createView(store)

        const result = await view.has('key')

        expect(result).toBe(false)
      } finally {
        await store.close()
      }
    })
  })

  describe('get', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      try {
        await setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = await view.get('key')

        expect(result).toStrictEqual('value')
      } finally {
        await store.close()
      }
    })

    test('item does not exist', async () => {
      const store = new DiskStore()
      try {
        const view = createView(store)

        const result = await view.get('key')

        expect(result).toBeUndefined()
      } finally {
        await store.close()
      }
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      try {
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
      } finally {
        await store.close()
      }
    })

    test('data does not exist', async () => {
      const store = new DiskStore()
      try {
        const view = createView(store)

        const result = await view.set('key', 'value')

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value: Buffer.from('value')
        })
      } finally {
        await store.close()
      }
    })
  })

  test('delete', async () => {
    const store = new DiskStore()
    try {
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = await view.delete('key')

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    } finally {
      await store.close()
    }
  })

  test('clear', async () => {
    const store = new DiskStore()
    try {
      await setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)

      const result = await view.clear()

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    } finally {
      await store.close()
    }
  })

  describe('keys', () => {
    test('non-undefined', async () => {
      const store = new DiskStore()
      try {
        await setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const iter = view.keys()
        const result = await toArrayAsync(iter)

        expect(result).toStrictEqual(['key'])
      } finally {
        await store.close()
      }
    })

    test('undefined', async () => {
      const store = new DiskStore()
      try {
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
      } finally {
        await store.close()
      }
    })
  })
})

function createViewWithPrefix(
  store: DiskStore
, prefix: string
): DiskStoreView<string, string> {
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
