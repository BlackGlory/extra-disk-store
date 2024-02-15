# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.0](https://github.com/BlackGlory/extra-disk-store/compare/v0.5.1...v0.6.0) (2024-02-15)


### ⚠ BREAKING CHANGES

* Node.js v16 => Node.js v18.17

* upgrade dependencies ([b3a7c80](https://github.com/BlackGlory/extra-disk-store/commit/b3a7c80cbed78e6fe0f4a60c38156c3cdf42d2f5))

### [0.5.1](https://github.com/BlackGlory/extra-disk-store/compare/v0.5.0...v0.5.1) (2023-06-10)


### Bug Fixes

* export src ([2b27ef7](https://github.com/BlackGlory/extra-disk-store/commit/2b27ef73b54496553529c2317063a2f084101f08))

## [0.5.0](https://github.com/BlackGlory/extra-disk-store/compare/v0.4.0...v0.5.0) (2023-03-12)


### ⚠ BREAKING CHANGES

* Removed `keys` methods
* - Changed the return value of `has` method.
- Changed the return value of `get` method.
- Removed `keys` method.
* CommonJS => ESM

* upgrade dependencies ([bf6d688](https://github.com/BlackGlory/extra-disk-store/commit/bf6d6881c4bcc1e277b88c250d2d2fcb7aa3ef53))
* use hash as a substitute for key to bypass key size limit of LMDB ([40b8851](https://github.com/BlackGlory/extra-disk-store/commit/40b885190c3294f659d3cf41fc1327d2c742ec9e))
* use hash as a substitute for key to bypass key size limit of LMDB ([29ad760](https://github.com/BlackGlory/extra-disk-store/commit/29ad7608d850ac26a54e06f6042bd2b20a9a7e90))

## [0.4.0](https://github.com/BlackGlory/extra-disk-store/compare/v0.3.2...v0.4.0) (2022-12-21)


### ⚠ BREAKING CHANGES

* - The minimal version of Node.js is 16.
- Rewritten `ZstandardValueConveter`.

* upgrade dependencies ([5424ab2](https://github.com/BlackGlory/extra-disk-store/commit/5424ab258e39d11ba6b246166772adbd1cd80263))

### [0.3.2](https://github.com/BlackGlory/extra-disk-store/compare/v0.3.1...v0.3.2) (2022-12-21)

### [0.3.1](https://github.com/BlackGlory/extra-disk-store/compare/v0.3.0...v0.3.1) (2022-12-12)

## [0.3.0](https://github.com/BlackGlory/extra-disk-store/compare/v0.2.1...v0.3.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* The return type of `DiskStoreWithCache#has` changed

* improve the return type of `DiskStoreWithCache#has` ([bdafdef](https://github.com/BlackGlory/extra-disk-store/commit/bdafdef3ed5134e5bd0f447149f70a7b566cbc44))

### [0.2.1](https://github.com/BlackGlory/extra-disk-store/compare/v0.2.0...v0.2.1) (2022-12-07)

## [0.2.0](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.5...v0.2.0) (2022-12-07)


### ⚠ BREAKING CHANGES

* - Rewritten
- Replaced sqlite3 with LMDB

### Features

* rewrite ([6376eb4](https://github.com/BlackGlory/extra-disk-store/commit/6376eb4d03a00f1039f58b99663d51cfe1832856))

### [0.1.5](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.4...v0.1.5) (2022-12-06)


### Features

* add the optional parameter `cache` ([e30fd73](https://github.com/BlackGlory/extra-disk-store/commit/e30fd73d201ca48d74a91cfc8cbb7a737bd8811c))

### [0.1.4](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.3...v0.1.4) (2022-12-05)


### Bug Fixes

* keys ([2bc0e74](https://github.com/BlackGlory/extra-disk-store/commit/2bc0e741fe332ec850497adba028d0582b7de60d))

### [0.1.3](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.2...v0.1.3) (2022-12-05)


### Features

* add `PrefixKeyConverter`, `PrefixKeyAsyncConverter` ([7493c2d](https://github.com/BlackGlory/extra-disk-store/commit/7493c2d5028d87b2a61c36255ba278cfe1424263))

### [0.1.2](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.1...v0.1.2) (2022-12-02)


### Bug Fixes

* signatures ([e50d765](https://github.com/BlackGlory/extra-disk-store/commit/e50d765b806bb48c22acb71f799c513b05ecdb5a))

### [0.1.1](https://github.com/BlackGlory/extra-disk-store/compare/v0.1.0...v0.1.1) (2022-12-02)


### Bug Fixes

* edge cases ([2d1b290](https://github.com/BlackGlory/extra-disk-store/commit/2d1b290396338b38d1812515a3fcf0f544923eb6))

## 0.1.0 (2022-12-01)


### Features

* init ([0919910](https://github.com/BlackGlory/extra-disk-store/commit/09199105cb6fe45b07cd64ce52e59de9b69a175d))
