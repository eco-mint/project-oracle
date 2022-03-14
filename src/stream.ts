import { TileDocument } from '@ceramicnetwork/stream-tile'
import Ceramic from '@ceramicnetwork/http-client'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import KeyDidResolver from 'key-did-resolver'
import { Resolver } from 'did-resolver'
import { DID } from 'dids'
import { decodeBase64 } from 'dids/lib/utils'
import { CommitID } from '@ceramicnetwork/streamid'

const knownCeramicUri = 'https://ceramic-clay.3boxlabs.com'
const knownEncodedSeed = '7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o='

// Connect to the remote Ceramic node
const ceramic: Ceramic = new Ceramic(knownCeramicUri)

// what a commit for our schema looks like
interface Commit {
  createdAt: string
  description: string
  contentUri: string
}

/**
 * Create a stream
 */
export async function createStream (description: string, uri: string): Promise<string> {
  console.debug('creating stream with schema - %s - %s', description, uri)

  const seed: Uint8Array = decodeBase64(knownEncodedSeed)
  await authenticateCeramic(seed)

  // create schema ID and save it
  const schema: CommitID = await createSchemaDocument()
  console.log('got schema: %s', schema)

  // create a tile document stream and pin it
  const content: Commit = await generateCommitData(description, uri)

  const doc: TileDocument = await TileDocument.create(ceramic, content, { schema }, { pin: true })
  console.log('genesis doc')
  console.log(doc.content)

  return doc.id.toString()
}

// `seed` must be a 32-byte long Uint8Array
async function authenticateCeramic (seed: Uint8Array) {
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

// Create the schema document and return the commit ID of the schema
async function createSchemaDocument (): Promise<CommitID> {
  // The following call will fail if the Ceramic instance does not have an authenticated DID
  const doc = await TileDocument.create(ceramic, {
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'https://angryteenagers.xyz',
    type: 'object',
    title: 'Angry Teenagers Oracle Data Schema',
    description: 'Oracle data schema for the Angry Teenagers NFT project.',
    examples: [
      {
        createdAt: '2022-01-01T01:02:03.04Z',
        description: 'An image showing reforestation over the last month.',
        contentURI: 'https://angryteenagers.xyz'
      }
    ],
    required: [
      'createdAt',
      'description',
      'contentUri'
    ],
    properties: {
      createdAt: {
        $id: '#/properties/createdAt',
        type: 'string',
        title: 'The createdAt property',
        description: 'Normalized RFC3339 timestamp for when this commit was created.'
      },
      description: {
        $id: '#/properties/description',
        type: 'string',
        title: 'The description property',
        description: 'Human-readable text that gives insight into the content of the commit and its purpose.'
      },
      contentUri: {
        $id: '#/properties/contentUri',
        type: 'string',
        format: 'uri',
        title: 'The contentUri property',
        description: 'A valid URI that points to the content of this commit. The content can be of any type, hosted in any location.'
      }
    },
    additionalProperties: true
  })
  // The stream ID of the created document can then be accessed as the `id` property
  return doc.commitId
}

export async function viewStream (streamId: string, commitId: string, latest: boolean) {
  if (latest) {
    console.log('viewing stream %s latest commit', streamId)
  } else {
    console.log('viewing stream %s-%s', streamId, commitId)
  }
}

export async function updateStream (streamId: string, description: string, uri: string) {
  console.log('updating stream %s-%s-%s', streamId, description, uri)
}

async function generateCommitData (description: string, uri: string): Promise<Commit> {
  return {
    createdAt: new Date().toISOString(),
    description: description,
    contentUri: uri
  }
}
