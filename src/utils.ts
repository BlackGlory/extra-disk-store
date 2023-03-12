import * as crypto from 'crypto'
import { TypedArray } from '@blackglory/prelude'

export function sha256(input: string | DataView | TypedArray): Buffer {
  return crypto.createHash('sha256')
    .update(input)
    .digest()
}
