import path from 'path'
import Database, { Database as IDatabase } from 'better-sqlite3'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import { go, assert } from '@blackglory/prelude'
import { map } from 'extra-promise'
import { findUpPackageFilename } from 'extra-filesystem'
import * as Iter from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export class DiskStore {
  private constructor(public _db: IDatabase) {}

  static async create(filename?: string): Promise<DiskStore> {
    const db = await go(async () => {
      const db = new Database(filename ?? ':memory:')

      await migrateDatabase(db)

      db.unsafeMode(true)

      return db
    })

    return new this(db)

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

  has = withLazyStatic((key: string): boolean => {
    const row = lazyStatic(() => this._db.prepare(`
      SELECT EXISTS(
               SELECT *
                 FROM store
                WHERE key = $key
             ) AS item_exists
    `), [this._db]).get({ key }) as { item_exists: 1 | 0 }

    return row.item_exists === 1
  })

  get = withLazyStatic((key: string): Buffer | undefined => {
    const row = lazyStatic(() => this._db.prepare(`
      SELECT value
        FROM store
       WHERE key = $key
    `), [this._db]).get({ key }) as { value: Buffer } | undefined

    return row?.value
  })

  set = withLazyStatic((key: string, value: Buffer): void => {
    lazyStatic(() => this._db.prepare(`
      INSERT INTO store (
                    key
                  , value
                  )
           VALUES ($key, $value)
               ON CONFLICT(key)
               DO UPDATE SET value = $value
    `), [this._db]).run({
      key
    , value
    })
  })

  delete = withLazyStatic((key: string): void => {
    lazyStatic(() => this._db.prepare(`
      DELETE FROM store
       WHERE key = $key
    `), [this._db]).run({ key })
  })

  clear = withLazyStatic((): void => {
    lazyStatic(() => this._db.prepare(`
      DELETE FROM store
    `), [this._db]).run()
  })

  keys = withLazyStatic((): IterableIterator<string> => {
    const iter = lazyStatic(() => this._db.prepare(`
      SELECT key
        FROM store
    `), [this._db]).iterate() as IterableIterator<{ key: string }>

    return Iter.map(iter, ({ key }) => key)
  })
}
