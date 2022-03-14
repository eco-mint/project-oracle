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
// TODO(gabe) allow these to be set from config
const knownCeramicUri = 'https://ceramic-clay.3boxlabs.com';
const knownEncodedSeed = '7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o=';
// Connect to the remote Ceramic node
const ceramic = new http_client_1.default(knownCeramicUri);
/**
 * Create a stream
 */
function createStream(desc, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.debug('creating stream with schema - %s - %s', desc, uri)
        yield authenticateCeramic();
        // create a tile document stream and pin it
        const content = generateCommitData(desc, uri);
        const doc = yield stream_tile_1.TileDocument.create(ceramic, content, undefined, { pin: true });
        return doc.id.toString();
    });
}
exports.createStream = createStream;
function viewStream(streamId, commitId, latest) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('viewing stream with id-commitId-latest', streamId, commitId, latest);
        yield authenticateCeramic();
        if (commitId !== undefined) {
            console.log('Viewing commit %s', commitId);
            const loaded = yield stream_tile_1.TileDocument.load(ceramic, commitId);
            console.log(loaded);
        }
        const loaded = yield stream_tile_1.TileDocument.load(ceramic, streamId);
        if (latest) {
            console.log('Viewing latest commit for stream %s', streamId);
            console.log(loaded.content);
        }
        else {
            console.log('Viewing stream:', streamId);
            console.log('Controllers:', loaded.metadata.controllers);
            console.log('Commits:', loaded.allCommitIds.map(c => c.toString()));
        }
    });
}
exports.viewStream = viewStream;
function updateStream(streamId, description, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        console.debug('updating stream %s-%s-%s', streamId, description, uri);
        yield authenticateCeramic();
    });
}
exports.updateStream = updateStream;
// `seed` must be a 32-byte long Uint8Array
function authenticateCeramic() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const seed = (0, utils_1.decodeBase64)(knownEncodedSeed);
        // Provide the DID Resolver and Provider to Ceramic
        const resolver = new did_resolver_1.Resolver(Object.assign(Object.assign({}, key_did_resolver_1.default.getResolver()), _3id_did_resolver_1.default.getResolver(ceramic)));
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        const did = new dids_1.DID({ provider, resolver });
        yield ceramic.setDID(did);
        // Authenticate the Ceramic instance with the provider
        yield ((_a = ceramic.did) === null || _a === void 0 ? void 0 : _a.authenticate());
    });
}
function generateCommitData(desc, uri) {
    const timestamp = new Date().toISOString();
    return {
        createdAt: timestamp,
        description: desc,
        contentUri: uri
    };
}
