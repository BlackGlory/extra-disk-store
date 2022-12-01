import { setRawItem, getRawItem, hasRawItem } from '@test/utils'
import { DiskStore } from '@src/disk-store'
import { DiskStoreView } from '@src/disk-store-view'
import { toArray } from '@blackglory/prelude'
import '@blackglory/jest-matchers'

describe('DiskStoreView', () => {
  describe('has', () => {
    describe('item exists', () => {
      it('return true', async () => {
        const cache = await DiskStore.create()
        setRawItem(cache, {
          key: 'key'
        , value: Buffer.from('value')
        })
        const view = createView(cache)

        const result = view.has('key')

        expect(result).toBe(true)
      })
    })

    describe('item does not exist', () => {
      it('return false', async () => {
        const cache = await DiskStore.create()
        const view = createView(cache)

        const result = view.has('key')

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

        const result = view.get('key')

        expect(result).toStrictEqual('value')
      })
    })

    describe('item does not exist', () => {
      it('return item', async () => {
        const cache = await DiskStore.create()
        const view = createView(cache)

        const result = view.get('key')

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

      const result = view.set('key', newValue)

      expect(result).toBeUndefined()
      expect(getRawItem(cache, 'key')).toEqual({
        key: 'key'
      , value: Buffer.from(newValue)
      })
    })

    test('data does not exist', async () => {
      const cache = await DiskStore.create()
      const view = createView(cache)

      const result = view.set('key', 'value')

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

    const result = view.delete('key')

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
    const result = toArray(iter)

    expect(result).toStrictEqual(['key'])
  })
})

function createView(cache: DiskStore): DiskStoreView<string, string> {
  return new DiskStoreView<string, string>(
    cache
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
