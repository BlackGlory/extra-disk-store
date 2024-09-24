-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

CREATE TABLE store (
  key          TEXT    NOT NULL UNIQUE
, value        BLOB    NOT NULL
) STRICT;
