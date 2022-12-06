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

const benchmark = new Benchmark('I/O performance')

go(async () => {
  benchmark.addCase('LevelDB (write)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'binary'
    })

    return {
      beforeEach() {
        store.clear()
      }
    , iterate() {
        for (let i = 100; i--;) {
          store.put(`${i}`, JSON.stringify(i))
        }
      }
    , async afterAll() {
        await store.close()
        await db.close()
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
        await remove(filename)
      }
    }
  })

  benchmark.addCase('LevelDB (overwrite)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'binary'
    })
    for (let i = 100; i--;) {
      store.put(`${i}`, JSON.stringify(i))
    }

    return {
      iterate() {
        for (let i = 100; i--;) {
          store.put(`${i}`, JSON.stringify(i))
        }
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


  benchmark.addCase('LevelDB (read)', async () => {
    const filename = await createTempName()
    const db = new Level(filename)
    await db.open()
    const store = db.sublevel('store', {
      valueEncoding: 'binary'
    })
    for (let i = 100; i--;) {
      store.put(`${i}`, JSON.stringify(i))
    }

    return {
      iterate() {
        for (let i = 100; i--;) {
          store.get(`${i}`)
        }
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
