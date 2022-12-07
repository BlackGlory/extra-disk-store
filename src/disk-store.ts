import * as Iter from 'iterable-operator'
import LMDB from 'lmdb'
import { createTempNameSync, remove } from 'extra-filesystem'
import { isUndefined } from '@blackglory/prelude'

export class DiskStore {
  public _db: LMDB.RootDatabase
  public _pathname: string
  private isTempPathname: boolean

  constructor(pathname?: string) {
    if (isUndefined(pathname)) {
      this._pathname = createTempNameSync()
      this.isTempPathname = true
    } else {
      this._pathname = pathname
      this.isTempPathname = false
    }

    this._db = LMDB.open<Buffer, string>(this._pathname, {
      encoding: 'binary'
    , compression: false
    })
  }

  async close(): Promise<void> {
    await this._db.close()

    if (this.isTempPathname) {
      await remove(this._pathname)
    }
  }

  has(key: string): boolean {
    return this._db.doesExist(key)
  }

  get(key: string): Buffer | undefined {
    return this._db.getBinary(key)
  }

  async set(key: string, value: Buffer): Promise<void> {
    await this._db.put(key, value)
  }

  async delete(key: string): Promise<void> {
    await this._db.remove(key)
  }

  async clear(): Promise<void> {
    await this._db.clearAsync()
  }

  keys(): IterableIterator<string> {
    return Iter.map(this._db.getKeys(), key => key as string)
  }
}
