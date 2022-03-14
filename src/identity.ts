import { randomBytes } from 'crypto'
import { encodeBase64 } from 'dids/lib/utils'

/**
 * createIdentity generates a 32 byte seed and returns it as a
 * base64 encoded string which can be accepted as an argument to this CLI.
 */
export async function createIdentity (): Promise<string> {
  console.log('creating identity')
  const seed = randomBytes(32)
  return encodeBase64(seed)
}
