import path from 'path'
import Database, { Database as IDatabase } from 'better-sqlite3'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import { go, assert, isUndefined, isBoolean } from '@blackglory/prelude'
import { map } from 'extra-promise'
import { findUpPackageFilename } from 'extra-filesystem'
import * as Iter from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { ICache } from './types'

export enum CacheKeyType {
  Exist
, Value
}

export class DiskStore {
  protected constructor(
    public _db: IDatabase
  , public cache?: ICache
  ) {}

  static async create(filename?: string, cache?: ICache): Promise<DiskStore> {
    const db = await go(async () => {
      const db = new Database(filename ?? ':memory:')

      await migrateDatabase(db)
      db.unsafeMode(true)

      return db
    })

    const diskStore = new this(db, cache)

    return diskStore

    async function migrateDatabase(db: IDatabase): Promise<void> {
      const packageFilename = await findUpPackageFilename(__dirname)
      assert(packageFilename, 'package.json not found')

      const packageRoot = path.dirname(packageFilename)
      const migrationsPath = path.join(packageRoot, 'migrations')
      const migrationFilenames = await findMigrationFilenames(migrationsPath)
      const migrations = await map(migrationFilenames, readMigrationFile)
      migrate(db, migrations)
    }
  }

  close(): void {
    this._db.exec(`
      PRAGMA analysis_limit=400;
      PRAGMA optimize;
    `)

    this._db.close()
  }

  has(key: string): boolean {
    if (this.cache) {
      const cacheKey = createCacheKey(CacheKeyType.Exist, key)
      const result = this.cache.get(cacheKey)
      if (isBoolean(result)) {
        return result
      } else {
        const result = this._has(key)
        this.cache.set(cacheKey, result)
        return result
      }
    } else {
      return this._has(key)
    }
  }

  private _has = withLazyStatic((key: string): boolean => {
    const row: { item_exists: 1 | 0 } = lazyStatic(() => this._db.prepare(`
      SELECT EXISTS(
              SELECT *
                FROM store
                WHERE key = $key
            ) AS item_exists
    `), [this._db]).get({ key })

    const result = row.item_exists === 1
    return result
  })

  get(key: string): Buffer | undefined {
    if (this.cache) {
      const cacheKey = createCacheKey(CacheKeyType.Value, key)
      const result = this.cache.get(cacheKey)
      if (result instanceof Buffer) {
        return result
      } else {
        const result = this._get(key)
        this.cache.set(cacheKey, result)
        return result
      }
    } else {
      return this._get(key)
    }
  }

  private _get = withLazyStatic((key: string): Buffer | undefined => {
    const row: {
      value: Buffer
    } | undefined = lazyStatic(() => this._db.prepare(`
      SELECT value
        FROM store
      WHERE key = $key
    `), [this._db]).get({ key })

    return isUndefined(row)
         ? undefined
         : row.value
  })

  set(key: string, value: Buffer): void {
    this._set(key, value)

    this.cache?.delete(createCacheKey(CacheKeyType.Value, key))
  }

  private _set = withLazyStatic((key: string, value: Buffer): void => {
    lazyStatic(() => this._db.prepare(`
      INSERT INTO store (
                    key
                  , value
                  )
           VALUES ($key, $value)
               ON CONFLICT(key)
               DO UPDATE SET value = $value
    `), [this._db]).run({ key, value })
  })

  delete(key: string): void {
    this._delete(key)

    if (this.cache) {
      this.cache.delete(createCacheKey(CacheKeyType.Exist, key))
      this.cache.delete(createCacheKey(CacheKeyType.Value, key))
    }
  }

  private _delete = withLazyStatic((key: string): void => {
    lazyStatic(() => this._db.prepare(`
      DELETE FROM store
       WHERE key = $key
    `), [this._db]).run({ key })
  })

  clear(): void {
    this._clear()

    this.cache?.clear()
  }

  private _clear = withLazyStatic((): void => {
    lazyStatic(() => this._db.prepare(`
      DELETE FROM store
    `), [this._db]).run()
  })

  keys = withLazyStatic((): IterableIterator<string> => {
    const iter: Iterable<{ key: string }> = lazyStatic(() => this._db.prepare(`
      SELECT key
        FROM store
    `), [this._db]).iterate()

    return Iter.map(iter, ({ key }) => key)
  })
}

export function createCacheKey(type: CacheKeyType, key: string): string {
  return JSON.stringify([type, key])
}
