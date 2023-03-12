import { DiskStore } from '@src/disk-store.js'
import { sha256 } from 'extra-compatible'

interface IRawItem {
  key: string
  value: Buffer
}

export async function setRawItem(store: DiskStore, raw: IRawItem): Promise<void> {
  await store._db.put(await sha256(raw.key), raw.value)
}

export async function getRawItem(
  store: DiskStore
, key: string
): Promise<IRawItem | undefined> {
  const value = store._db.getBinary(await sha256(key))
  if (value) {
    return { key, value }
  } else {
    return undefined
  }
}

export async function hasRawItem(store: DiskStore, key: string): Promise<boolean> {
  return store._db.doesExist(await sha256(key))
}
