import { DiskStore } from '@src/disk-store.js'

interface IRawItem {
  key: string
  value: Buffer
}

export function setRawItem(store: DiskStore, raw: IRawItem): void {
  store._db.prepare(`
    INSERT INTO store(
                  key
                , value
                )
         VALUES ($key, $value)
             ON CONFLICT(key)
             DO UPDATE SET value = $value
  `).run(raw)
}

export function getRawItem(store: DiskStore, key: string): IRawItem {
  return store._db.prepare(`
    SELECT *
      FROM store
     WHERE key = $key
  `).get({ key }) as IRawItem
}

export function hasRawItem(store: DiskStore, key: string): boolean {
  const result = store._db.prepare(`
    SELECT EXISTS(
             SELECT *
               FROM store
              WHERE key = $key
           ) AS item_exists
  `).get({ key }) as { item_exists: 1 | 0 }

  return result.item_exists === 1
}
