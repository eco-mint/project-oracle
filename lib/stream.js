"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStream = exports.viewStream = exports.createStream = void 0;
const stream_tile_1 = require("@ceramicnetwork/stream-tile");
const http_client_1 = __importDefault(require("@ceramicnetwork/http-client"));
const key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
const _3id_did_resolver_1 = __importDefault(require("@ceramicnetwork/3id-did-resolver"));
const key_did_resolver_1 = __importDefault(require("key-did-resolver"));
const did_resolver_1 = require("did-resolver");
const dids_1 = require("dids");
const utils_1 = require("dids/lib/utils");
const knownCeramicUri = 'https://ceramic-clay.3boxlabs.com';
const knownEncodedSeed = '7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o=';
// Connect to the remote Ceramic node
const ceramic = new http_client_1.default(knownCeramicUri);
/**
 * Create a stream
 */
function createStream(description, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        console.debug('creating stream with schema - %s - %s', description, uri);
        const seed = (0, utils_1.decodeBase64)(knownEncodedSeed);
        yield authenticateCeramic(seed);
        // create schema ID and save it
        const schema = yield createSchemaDocument();
        console.log('got schema: %s', schema);
        // create a tile document stream and pin it
        // const content: Commit = await generateCommitData(description, uri)
        const content = {
            contentUri: uri
        };
        const doc = yield stream_tile_1.TileDocument.create(ceramic, content, undefined, { pin: true });
        console.log('genesis doc');
        console.log(doc.content);
        return doc.id.toString();
    });
}
exports.createStream = createStream;
// `seed` must be a 32-byte long Uint8Array
function authenticateCeramic(seed) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Provide the DID Resolver and Provider to Ceramic
        const resolver = new did_resolver_1.Resolver(Object.assign(Object.assign({}, key_did_resolver_1.default.getResolver()), _3id_did_resolver_1.default.getResolver(ceramic)));
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        const did = new dids_1.DID({ provider, resolver });
        yield ceramic.setDID(did);
        // Authenticate the Ceramic instance with the provider
        yield ((_a = ceramic.did) === null || _a === void 0 ? void 0 : _a.authenticate());
    });
}
// Create the schema document and return the commit ID of the schema
function createSchemaDocument() {
    return __awaiter(this, void 0, void 0, function* () {
        // The following call will fail if the Ceramic instance does not have an authenticated DID
        const doc = yield stream_tile_1.TileDocument.create(ceramic, {
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
                'contentURI'
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
                    $id: '#/properties/contentURI',
                    type: 'string',
                    format: 'uri',
                    title: 'The contentURI property',
                    description: 'A valid URI that points to the content of this commit. The content can be of any type, hosted in any location.'
                }
            },
            additionalProperties: true
        });
        // The stream ID of the created document can then be accessed as the `id` property
        return doc.commitId;
    });
}
function viewStream(streamId, commitId, latest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (latest) {
            console.log('viewing stream %s latest commit', streamId);
        }
        else {
            console.log('viewing stream %s-%s', streamId, commitId);
        }
    });
}
exports.viewStream = viewStream;
function updateStream(streamId, description, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('updating stream %s-%s-%s', streamId, description, uri);
    });
}
exports.updateStream = updateStream;
function generateCommitData(description, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdAt = new Date().toISOString();
        return {
            createdAt: createdAt,
            description: description,
            contentUri: uri
        };
    });
}
