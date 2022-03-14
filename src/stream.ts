import { TileDocument } from '@ceramicnetwork/stream-tile'
import Ceramic from '@ceramicnetwork/http-client'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import KeyDidResolver from 'key-did-resolver'
import { Resolver } from 'did-resolver'
import { DID } from 'dids'
import { decodeBase64 } from 'dids/lib/utils'

// TODO(gabe) allow these to be set from config
const knownCeramicUri = 'https://ceramic-clay.3boxlabs.com'
const knownEncodedSeed = '7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o='

// Connect to the remote Ceramic node
const ceramic: Ceramic = new Ceramic(knownCeramicUri)

// what a commit for our schema looks like
interface OracleCommit {
  createdAt: string;
  description: string;
  contentUri: string;
}

/**
 * Create a stream
 */
export async function createStream (desc: string, uri: string): Promise<string> {
  // console.debug('creating stream with schema - %s - %s', desc, uri)
  await authenticateCeramic()

  // create a tile document stream and pin it
  const content: OracleCommit = generateCommitData(desc, uri)
  const doc = await TileDocument.create(ceramic, content, undefined, { pin: true })

  return doc.id.toString()
}

export async function viewStream (streamId: string, commitId: string, latest: boolean) {
  // console.debug('viewing stream with id-commitId-latest', streamId, commitId, latest)
  await authenticateCeramic()

  if (commitId !== undefined) {
    console.log('Viewing commit %s', commitId)
    const loaded = await TileDocument.load(ceramic, commitId)
    console.log(loaded)
    return
  }

  const loaded = await TileDocument.load(ceramic, streamId)
  if (latest) {
    console.log('Viewing latest commit for stream %s', streamId)
    console.log(loaded.content)
  } else {
    console.log('Viewing stream:', streamId)
    console.log('Controllers:', loaded.metadata.controllers)
    console.log('Commits:', loaded.allCommitIds.map(c => c.toString()))
  }
}

export async function updateStream (streamId: string, description: string, uri: string) {
  console.debug('updating stream %s-%s-%s', streamId, description, uri)

  await authenticateCeramic()
}

// `seed` must be a 32-byte long Uint8Array
async function authenticateCeramic () {
  const seed: Uint8Array = decodeBase64(knownEncodedSeed)

  // Provide the DID Resolver and Provider to Ceramic
  const resolver = new Resolver({
    ...KeyDidResolver.getResolver(),
    ...ThreeIdResolver.getResolver(ceramic)
  })

  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver })
  await ceramic.setDID(did)

  // Authenticate the Ceramic instance with the provider
  await ceramic.did?.authenticate()
}

function generateCommitData (desc: string, uri: string): OracleCommit {
  const timestamp = new Date().toISOString()
  return {
    createdAt: timestamp,
    description: desc,
    contentUri: uri
  }
}
