import { Benchmark } from 'extra-benchmark'
import { go } from '@blackglory/prelude'
import {
  DiskStore
, DiskStoreWithCache
, DiskStoreView
, IndexKeyConverter
, JSONValueConverter
} from '../lib/index.js'
import { createTempName, remove } from 'extra-filesystem'
import { LRUMap } from '@blackglory/structures'

const benchmark = new Benchmark('I/O performance')

go(async () => {
  benchmark.addCase('DiskStore (write)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
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
        await remove(filename)
      }
    }
  })

  benchmark.addCase('DiskStoreWithCache (write)', async () => {
    const filename = await createTempName()
    const diskStore = await DiskStore.create(filename)
    const memoryCache = new LRUMap<string, any>(100)
    const store = new DiskStoreWithCache(diskStore, memoryCache)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
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
        await remove(filename)
      }
    }
  })

  benchmark.addCase('DiskStore (overwrite)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
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

  benchmark.addCase('DiskStoreWithCache (overwrite)', async () => {
    const filename = await createTempName()
    const diskStore = await DiskStore.create(filename)
    const memoryCache = new LRUMap<string, any>(100)
    const store = new DiskStoreWithCache(diskStore, memoryCache)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
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

  benchmark.addCase('DiskStore (read)', async () => {
    const filename = await createTempName()
    const store = await DiskStore.create(filename)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
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

  benchmark.addCase('DiskStoreWithCache (read)', async () => {
    const filename = await createTempName()
    const diskStore = await DiskStore.create(filename)
    const memoryCache = new LRUMap<string, any>(100)
    const store = new DiskStoreWithCache(diskStore, memoryCache)
    const view = new DiskStoreView(
      store
    , new IndexKeyConverter()
    , new JSONValueConverter()
    )
    for (let i = 100; i--;) {
      await view.set(i, i)
    }

    return {
      async iterate() {
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
