import { randomBytes } from 'crypto';
import {encodeBase64} from "dids/lib/utils";

export async function createIdentity(): Promise<string> {
    console.log("creating identity")
    const seed = randomBytes(32);
    return encodeBase64(seed)
}