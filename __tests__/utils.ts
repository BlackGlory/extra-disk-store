import { DiskStore } from '@src/disk-store.js'

interface IRawItem {
  key: string
  value: Buffer
}

export async function setRawItem(store: DiskStore, raw: IRawItem): Promise<void> {
  await store._db.put(raw.key, raw.value)
}

export function getRawItem(store: DiskStore, key: string): IRawItem | undefined {
  const value = store._db.getBinary(key)
  if (value) {
    return { key, value }
  } else {
    return undefined
  }
}

export function hasRawItem(store: DiskStore, key: string): boolean {
  return store._db.doesExist(key)
}
