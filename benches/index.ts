import { Benchmark } from 'extra-benchmark'
import { go } from '@blackglory/prelude'
import {
  DiskStore
, DiskStoreView
, IndexKeyConverter as StoreIndexKeyConverter
, JSONValueConverter as StoreJSONValueConverter
} from '..'
import { createTempName, remove } from 'extra-filesystem'
import { Level } from 'level'
import fs from 'fs/promises'
import prettyBytes from 'pretty-bytes'
import lmdb from 'lmdb'

const benchmark = new Benchmark('I/O performance')

go(async () => {
  benchmark.addCase('Map (write)', async () => {
    const map = new Map<string, string>()

    return {
      beforeEach() {
        map.clear()
      }
    , iterate() {
        for (let i = 100; i--;) {
          map.set(`${i}`, JSON.stringify(i))
        }
      }
    }
  })

  benchmark.addCase('LMDB (write)', async () => {
    const filename = await createTempName()
    const db = lmdb.open({
      path: filename
    , compression: false
    , encoding: 'binary'
    })

    return {
      async beforeEach() {
        await db.clearAsync()
      }
    , async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 100; i--;) {
          promises.push(db.put(`${i}`, Buffer.from(JSON.stringify(i))))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await db.close()

        const { size } = await fs.stat(filename)
        console.log(`LMDB (write) size: ${prettyBytes(size)}`)

        await remove(filename)
      }
    }
  })

  benchmark.addCase('LevelDB (write)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'utf8'
    })

    return {
      beforeEach() {
        store.clear()
      }
    , async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 100; i--;) {
          promises.push(store.put(`${i}`, JSON.stringify(i)))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
        await db.close()

        const { size } = await fs.stat(filename)
        console.log(`LevelDB (write) size: ${prettyBytes(size)}`)

        await remove(filename)
      }
    }
  })

  benchmark.addCase('ExtraDiskStore (write)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new StoreIndexKeyConverter()
    , new StoreJSONValueConverter()
    )

    return {
      beforeEach() {
        store.clear()
      }
    , iterate() {
        for (let i = 100; i--;) {
          view.set(i, i)
        }
      }
    , async afterAll() {
        store.close()

        const { size } = await fs.stat(filename)
        console.log(`ExtraDiskStore (write) size: ${prettyBytes(size)}`)

        await remove(filename)
      }
    }
  })

  benchmark.addCase('Map (overwrite)', async () => {
    const map = new Map<string, string>()
    for (let i = 100; i--;) {
      map.set(`${i}`, JSON.stringify(i))
    }

    return () => {
      for (let i = 100; i--;) {
        map.set(`${i}`, JSON.stringify(i))
      }
    }
  })

  benchmark.addCase('LevelDB (overwrite)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'utf8'
    })
    for (let i = 100; i--;) {
      await store.put(`${i}`, JSON.stringify(i))
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 100; i--;) {
          promises.push(store.put(`${i}`, JSON.stringify(i)))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
        await db.close()
        await remove(filename)
      }
    }
  })

  benchmark.addCase('ExtraDiskStore (overwrite)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new StoreIndexKeyConverter()
    , new StoreJSONValueConverter()
    )
    for (let i = 100; i--;) {
      view.set(i, i)
    }

    return {
      iterate() {
        for (let i = 100; i--;) {
          view.set(i, i)
        }
      }
    , async afterAll() {
        store.close()
        await remove(filename)
      }
    }
  })

  benchmark.addCase('Map (read)', async () => {
    const map = new Map<string, string>()
    for (let i = 100; i--;) {
      map.set(`${i}`, JSON.stringify(i))
    }

    return () => {
      for (let i = 100; i--;) {
        map.set(`${i}`, JSON.stringify(i))
      }
    }
  })

  benchmark.addCase('LevelDB (read)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'utf8'
    })
    for (let i = 100; i--;) {
      await store.put(`${i}`, JSON.stringify(i))
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 100; i--;) {
          promises.push(store.get(`${i}`))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
        await db.close()
        await remove(filename)
      }
    }
  })

  benchmark.addCase('ExtraDiskStore (read)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new StoreIndexKeyConverter()
    , new StoreJSONValueConverter()
    )
    for (let i = 100; i--;) {
      view.set(i, i)
    }

    return {
      iterate() {
        for (let i = 100; i--;) {
          view.get(i)
        }
      }
    , async afterAll() {
        store.close()
        await remove(filename)
      }
    }
  })

  console.log(benchmark.name)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
