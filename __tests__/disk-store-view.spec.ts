import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import { DiskStoreView } from '@src/disk-store-view'
import { toArray } from '@blackglory/prelude'
import '@blackglory/jest-matchers'

describe('DiskStoreView', () => {
  describe('has', () => {
    describe('item exists', () => {
      it('return true', async () => {
        const store = await DiskStore.create()
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = view.has('key')

        expect(result).toBe(true)
      })
    })

    describe('item does not exist', () => {
      it('return false', async () => {
        const store = await DiskStore.create()
        const view = createView(store)

        const result = view.has('key')

        expect(result).toBe(false)
      })
    })
  })

  describe('get', () => {
    describe('item exists', () => {
      it('return item', async () => {
        const store = await DiskStore.create()
        setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(store)

        const result = view.get('key')

        expect(result).toStrictEqual('value')
      })
    })

    describe('item does not exist', () => {
      it('return item', async () => {
        const store = await DiskStore.create()
        const view = createView(store)

        const result = view.get('key')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('set', () => {
    test('item exists', async () => {
      const store = await DiskStore.create()
      setRawItem(store, {
        key: 'key'
      , value: Buffer.from('value')
      })
      const view = createView(store)
      const newValue = 'new value'

      const result = view.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(store, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from(newValue)
      })
    })

    test('data does not exist', async () => {
      const store = await DiskStore.create()
      const view = createView(store)

      const result = view.set('key', 'value')

      expect(result).toBeUndefined()
      expect(getRawItem(store, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from('value')
      })
    })
  })

  test('delete', async () => {
    const store = await DiskStore.create()
    setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(store)

    const result = view.delete('key')

    expect(result).toBeUndefined()
    expect(hasRawItem(store, 'key')).toBeFalsy()
  })

  test('clear', async () => {
    const store = await DiskStore.create()
    setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(store)

    const result = view.clear()

    expect(result).toBeUndefined()
    expect(hasRawItem(store, 'key')).toBeFalsy()
  })

  test('keys', async () => {
    const store = await DiskStore.create()
    setRawItem(store, {
      key: 'key'
    , value: Buffer.from('value')
    })
    const view = createView(store)

    const iter = view.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual(['key'])
  })
})

function createView(store: DiskStore): DiskStoreView<string, string> {
  return new DiskStoreView<string, string>(
    store
  , {
      toString: x => x
    , fromString: x => x
    }
  , { 
      fromBuffer: x => x.toString()
    , toBuffer: x => Buffer.from(x)
    }
  )
}
