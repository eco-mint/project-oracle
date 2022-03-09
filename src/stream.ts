import {TileDocument} from '@ceramicnetwork/stream-tile';
import Ceramic from '@ceramicnetwork/http-client';
import {Ed25519Provider} from 'key-did-provider-ed25519';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import KeyDidResolver from 'key-did-resolver';
import {Resolver} from 'did-resolver';
import {DID} from 'dids';
import {decodeBase64} from "dids/lib/utils";

const knownCeramicUri: string = "https://ceramic-clay.3boxlabs.com"
const knownEncodedSeed: string = "7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o="

/**
 * Create a stream
 */
export async function createStream(filePath: string): Promise<string> {
    console.log("creating stream with schema %s", filePath)
    const seed = decodeBase64(knownEncodedSeed)

    // Connect to the remote Ceramic node
    const ceramic: Ceramic = new Ceramic(knownCeramicUri);

    // Provide the DID Resolver and Provider to Ceramic
    const resolver = new Resolver({
        ...KeyDidResolver.getResolver(),
        ...ThreeIdResolver.getResolver(ceramic)
    });

    const provider = new Ed25519Provider(seed);
    const did = new DID({provider, resolver});
    await ceramic.setDID(did);

    // Authenticate the Ceramic instance with the provider
    // @ts-ignore
    await ceramic.did.authenticate();

    // create a tile document stream and pin it
    const content = {
        "test": "test content"
    };

    const doc = await TileDocument.create(ceramic, content, undefined, {pin: true});
    console.log('genesis doc');
    console.log(doc.content);

    return doc.id.toString()
}

export async function viewStream(streamId: string, commitId: string, latest: boolean) {
    if (latest) {
        console.log("viewing stream %s latest commit", streamId)
    } else {
        console.log("viewing stream %s-%s", streamId, commitId)
    }
}

export async function updateStream(streamId: string, description: string, uri: string) {
    console.log("updating stream %s-%s-%s", streamId, description, uri)
}