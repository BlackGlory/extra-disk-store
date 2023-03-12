import { setRawItem, getRawItem, hasRawItem } from '@test/utils.js'
import { DiskStore } from '@src/disk-store.js'

describe('DiskStore', () => {
  describe('has', () => {
    test('item exists', async () => {
      const store = new DiskStore()
      try {
        await setRawItem(store, {
          key: 'key'
        , value: Buffer.from('value')
        })

        const result = store.has('key')

        expect(result).toBe(true)
      } finally {
        await store.close()
      }
    })

    test('item does not exist', async () => {
      const store = new DiskStore()

      try {
        const result = store.has('key')

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
        const value = Buffer.from('value')
        await setRawItem(store, {
          key: 'key'
        , value
        })

        const result = store.get('key')

        expect(result).toStrictEqual(value)
      } finally {
        await store.close()
      }
    })

    test('item does not exist', async () => {
      const store = new DiskStore()

      try {
        const result = store.get('key')

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
        const value = Buffer.from('value')
        await setRawItem(store, {
          key: 'key'
        , value
        })
        const newValue = Buffer.from('new value')

        const result = await store.set('key', newValue)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value: newValue
        })
      } finally {
        await store.close()
      }
    })

    test('item does not exist', async () => {
      const store = new DiskStore()
      try {
        const value = Buffer.from('value')
        const result = await store.set('key', value)

        expect(result).toBeUndefined()
        expect(getRawItem(store, 'key')).toEqual({
          key: 'key'
        , value
        })
      } finally {
        await store.close()
      }
    })
  })

  test('delete', async () => {
    const store = new DiskStore()
    try {
      const value = Buffer.from('value')
      await setRawItem(store, {
        key: 'key'
      , value
      })

      const result = await store.delete('key')

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

      const result = await store.clear()

      expect(result).toBeUndefined()
      expect(hasRawItem(store, 'key')).toBeFalsy()
    } finally {
      await store.close()
    }
  })

  describe('close', () => {
    test('create, close', async () => {
      const store = new DiskStore()

      await store.close()
    })

    test('create, set, close', async () => {
      const store = new DiskStore()
      try {
        await store.set('key', Buffer.from('value'))
      } finally {
        await store.close()
      }
    })
  })
})
