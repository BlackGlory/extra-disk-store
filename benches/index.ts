import { Benchmark } from 'extra-benchmark'
import { go } from '@blackglory/prelude'
import {
  DiskStore
, DiskStoreWithCache
, DiskStoreView
, IndexKeyConverter
, JSONValueConverter
} from '../src/index.js'
import { createTempName, remove } from 'extra-filesystem'
import fs from 'fs/promises'
import prettyBytes from 'pretty-bytes'
import * as LMDB from 'lmdb'
import { LRUMap } from '@blackglory/structures'

const benchmark = new Benchmark('I/O performance')

go(async () => {
  benchmark.addCase('Map (write)', async () => {
    const map = new Map<string, string>()

    return {
      beforeEach() {
        map.clear()
      }
    , iterate() {
        for (let i = 1000; i--;) {
          map.set(`${i}`, JSON.stringify(i))
        }
      }
    }
  })

  benchmark.addCase('LMDB (write, non-concurrent)', async () => {
    const dirname = await createTempName()
    const db = LMDB.open(dirname, {
      compression: false
    , encoding: 'binary'
    })

    return {
      async beforeEach() {
        await db.clearAsync()
      }
    , async iterate() {
        for (let i = 1000; i--;) {
          await db.put(`${i}`, Buffer.from(JSON.stringify(i)))
        }
      }
    , async afterAll() {
        await db.close()

        const { size } = await fs.stat(dirname)
        console.log(`LMDB (write) size: ${prettyBytes(size)}`)

        await remove(dirname)
      }
    }
  })

  benchmark.addCase('LMDB (write, concurrent)', async () => {
    const dirname = await createTempName()
    const db = LMDB.open(dirname, {
      compression: false
    , encoding: 'binary'
    })

    return {
      async beforeEach() {
        await db.clearAsync()
      }
    , async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(db.put(`${i}`, Buffer.from(JSON.stringify(i))))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await db.close()

        const { size } = await fs.stat(dirname)
        console.log(`LMDB (write) size: ${prettyBytes(size)}`)

        await remove(dirname)
      }
    }
  })

  benchmark.addCase('DiskStore (write, non-concurrent)', async () => {
    const store = new DiskStore()
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )

    return {
      async beforeEach() {
        await store.clear()
      }
    , async iterate() {
        for (let i = 1000; i--;) {
          await view.set(i, i)
        }
      }
    , async afterAll() {
        const { size } = await fs.stat(store._dirname)
        console.log(`DiskStore (write) size: ${prettyBytes(size)}`)

        await store.close()
      }
    }
  })

  benchmark.addCase('DiskStore (write, concurrent)', async () => {
    const store = new DiskStore()
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )

    return {
      async beforeEach() {
        await store.clear()
      }
    , async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.set(i, i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        const { size } = await fs.stat(store._dirname)
        console.log(`DiskStore (write) size: ${prettyBytes(size)}`)

        await store.close()
      }
    }
  })

  benchmark.addCase('DiskStoreWithCache (write)', async () => {
    const store = new DiskStoreWithCache(new DiskStore(), new LRUMap(1000))
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )

    return {
      async beforeEach() {
        await store.clear()
      }
    , async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.set(i, i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
      }
    }
  })

  benchmark.addCase('Map (overwrite)', async () => {
    const map = new Map<string, string>()
    for (let i = 1000; i--;) {
      map.set(`${i}`, JSON.stringify(i))
    }

    return () => {
      for (let i = 1000; i--;) {
        map.set(`${i}`, JSON.stringify(i))
      }
    }
  })

  benchmark.addCase('LMDB (overwrite)', async () => {
    const dirname = await createTempName()
    const db = LMDB.open(dirname, {
      compression: false
    , encoding: 'binary'
    })
    for (let i = 1000; i--;) {
      await db.put(`${i}`, Buffer.from(JSON.stringify(i)))
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(db.put(`${i}`, Buffer.from(JSON.stringify(i))))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await db.close()
        await remove(dirname)
      }
    }
  })

  benchmark.addCase('DiskStore (overwrite)', async () => {
    const store = new DiskStore()
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )
    for (let i = 1000; i--;) {
      await view.set(i, i)
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.set(i, i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
      }
    }
  })

  benchmark.addCase('DiskStoreWithCache (overwrite)', async () => {
    const store = new DiskStoreWithCache(new DiskStore(), new LRUMap(1000))
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )
    for (let i = 1000; i--;) {
      await view.set(i, i)
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.set(i, i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
      }
    }
  })

  benchmark.addCase('Map (read)', async () => {
    const map = new Map<string, string>()
    for (let i = 1000; i--;) {
      map.set(`${i}`, JSON.stringify(i))
    }

    return () => {
      for (let i = 1000; i--;) {
        map.set(`${i}`, JSON.stringify(i))
      }
    }
  })

  benchmark.addCase('LMDB (read)', async () => {
    const dirname = await createTempName()
    const db = LMDB.open(dirname, {
      compression: false
    , encoding: 'binary'
    })
    for (let i = 1000; i--;) {
      await db.put(`${i}`, Buffer.from(JSON.stringify(i)))
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(db.get(`${i}`))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await db.close()
        await remove(dirname)
      }
    }
  })

  benchmark.addCase('DiskStore (read)', async () => {
    const store = new DiskStore()
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )
    for (let i = 1000; i--;) {
      await view.set(i, i)
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.get(i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
      }
    }
  })

  benchmark.addCase('DiskStoreWithCache (read)', async () => {
    const store = new DiskStoreWithCache(new DiskStore(), new LRUMap(1000))
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )
    for (let i = 1000; i--;) {
      await view.set(i, i)
    }

    return {
      async iterate() {
        const promises: Array<Promise<unknown>> = []
        for (let i = 1000; i--;) {
          promises.push(view.get(i))
        }
        await Promise.all(promises)
      }
    , async afterAll() {
        await store.close()
      }
    }
  })

  console.log(benchmark.name)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
