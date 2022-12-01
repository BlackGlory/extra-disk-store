import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import { DiskStoreAsyncView } from '@src/disk-store-async-view'
import { toArrayAsync } from '@blackglory/prelude'
import { delay } from 'extra-promise'
import '@blackglory/jest-matchers'

describe('DiskStoreAsyncView', () => {
  describe('has', () => {
    describe('item exists', () => {
      it('return true', async () => {
        const cache = await DiskStore.create()
        setRawItem(cache, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(cache)

        const result = await view.has('key')

        expect(result).toBe(true)
      })
    })

    describe('item does not exist', () => {
      it('return false', async () => {
        const cache = await DiskStore.create()
        const view = createView(cache)

        const result = await view.has('key')

        expect(result).toBe(false)
      })
    })
  })

  describe('get', () => {
    describe('item exists', () => {
      it('return item', async () => {
        const cache = await DiskStore.create()
        setRawItem(cache, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(cache)

        const result = await view.get('key')

        expect(result).toStrictEqual('value')
      })
    })

    describe('item does not exist', () => {
      it('return item', async () => {
        const cache = await DiskStore.create()
        const view = createView(cache)

        const result = await view.get('key')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const cache = await DiskStore.create()
      setRawItem(cache, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(cache)
      const newValue = 'new value'

      const result = await view.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(cache, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from(newValue)
      })
    })

    test('data does not exist', async () => {
      const cache = await DiskStore.create()
      const view = createView(cache)

      const result = await view.set('key', 'value')

      expect(result).toBeUndefined()
      expect(getRawItem(cache, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from('value')
      })
    })
  })

  test('delete', async () => {
    const cache = await DiskStore.create()
    setRawItem(cache, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(cache)

    const result = await view.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(cache, 'key')).toBeFalsy()
  })

  test('clear', async () => {
    const cache = await DiskStore.create()
    setRawItem(cache, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(cache)

    const result = view.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(cache, 'key')).toBeFalsy()
  })

  test('keys', async () => {
    const cache = await DiskStore.create()
    setRawItem(cache, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(cache)

    const iter = view.keys()
    const result = await toArrayAsync(iter)

    expect(result).toStrictEqual(['key'])
  })
})

function createView(cache: DiskStore): DiskStoreAsyncView<string, string> {
  return new DiskStoreAsyncView<string, string>(
    cache
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
