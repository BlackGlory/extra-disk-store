import * as LMDB from 'lmdb'
import { createTempNameSync, remove } from 'extra-filesystem'
import { isUndefined } from '@blackglory/prelude'
import { sha256 } from './utils.js'

export class DiskStore {
  public _db: LMDB.RootDatabase
  public _dirname: string
  private isTempPathname: boolean

  constructor(dirname?: string) {
    if (isUndefined(dirname)) {
      this._dirname = createTempNameSync()
      this.isTempPathname = true
    } else {
      this._dirname = dirname
      this.isTempPathname = false
    }

    this._db = LMDB.open<Buffer, string>(this._dirname, {
      // 采用其他编码方式可能遇到错误.
      // 尤其是采用与lmdb-js同作者的msgpackr一定会出现错误, 因为它是一个有问题的实现.
      encoding: 'binary'
    , compression: false
    })
  }

  async close(): Promise<void> {
    await this._db.close()

    if (this.isTempPathname) {
      await remove(this._dirname)
    }
  }

  has(key: string): boolean {
    return this._db.doesExist(sha256(key))
  }

  get(key: string): Buffer | undefined {
    return this._db.getBinary(sha256(key))
  }

  async set(key: string, value: Buffer): Promise<void> {
    await this._db.put(sha256(key), value)
  }

  async delete(key: string): Promise<void> {
    await this._db.remove(sha256(key))
  }

  async clear(): Promise<void> {
    await this._db.clearAsync()
  }
}
