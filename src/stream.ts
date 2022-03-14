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
 * Create a stream with a description and uri
 */
export async function createStream (description: string, contentUri: string): Promise<string> {
  // console.debug('creating stream with schema - %s - %s', desc, uri)
  await authenticateCeramic()

  // create a tile document stream and pin it
  const content: OracleCommit = generateCommitData(description, contentUri)
  const doc = await TileDocument.create(ceramic, content, undefined, { pin: true })

  return doc.id.toString()
}

/**
 * View a stream
 * Able to do three possible things:
 * (1) view information about a stream including its controllers and commits
 * (2) view a specific commit id for a stream
 * (3) view information from the latest commit in a stream
 */
export async function viewStream (streamId: string, commitId: string, latest: boolean) {
  // console.debug('viewing stream with id-commitId-latest', streamId, commitId, latest)
  await authenticateCeramic()

  if (commitId !== undefined) {
    console.log('Viewing commit %s', commitId)
    const loaded = await TileDocument.load(ceramic, commitId)
    const extracted = extractOracleCommit(loaded)
    console.log(extracted)
    return
  }

  const loaded = await TileDocument.load(ceramic, streamId)
  if (latest) {
    console.log('Viewing latest commit for stream %s', streamId)
    const extracted = extractOracleCommit(loaded)
    console.log(extracted)
  } else {
    console.log('Viewing stream:', streamId)
    console.log('Controllers:', loaded.metadata.controllers)
    console.log('Commits:', loaded.allCommitIds.map(c => c.toString()))
  }
}

/**
 * Update a stream with a description and uri
 */
export async function updateStream (streamId: string, description: string, contentUri: string) {
  // console.debug('updating stream %s-%s-%s', streamId, description, contentUri)

  if (description === undefined || contentUri === undefined) {
    console.log('must have both --description and --contentUri flags set')
    return
  }

  await authenticateCeramic()

  // load stream, generate new commit data
  const loaded = await TileDocument.load(ceramic, streamId)
  const content: OracleCommit = generateCommitData(description, contentUri)

  // update the document with the commit content
  await loaded.update(content)

  // load the updated stream and read back the last written record
  const updated = await TileDocument.load(ceramic, streamId)
  console.log('Updated stream, latest commit: ', updated.content)
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

// from a tile document, pull out our known content structure
function extractOracleCommit (doc: TileDocument<unknown>): OracleCommit {
  const loadedContent = JSON.stringify(doc.content)
  const jsonContent = JSON.parse(loadedContent)
  return {
    createdAt: jsonContent.createdAt,
    description: jsonContent.description,
    contentUri: jsonContent.contentUri
  }
}
