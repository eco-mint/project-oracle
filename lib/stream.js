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
const knownCeramicUri = "https://ceramic-clay.3boxlabs.com";
/**
 * Create a stream
 */
function createStream(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("creating stream with schema %s", filePath);
        const encodedSeed = "7Qn5djvQ0KidtdAygpeKjznabVzn6CrRAgASIBevP3o=";
        const seed = (0, utils_1.decodeBase64)(encodedSeed);
        // Connect to the remote Ceramic node
        const ceramic = new http_client_1.default(knownCeramicUri);
        // Provide the DID Resolver and Provider to Ceramic
        const resolver = new did_resolver_1.Resolver(Object.assign(Object.assign({}, key_did_resolver_1.default.getResolver()), _3id_did_resolver_1.default.getResolver(ceramic)));
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        const did = new dids_1.DID({ provider, resolver });
        yield ceramic.setDID(did);
        // Authenticate the Ceramic instance with the provider
        // @ts-ignore
        yield ceramic.did.authenticate();
        // create a tile document stream and pin it
        const content = {
            "test": "test content"
        };
        const doc = yield stream_tile_1.TileDocument.create(ceramic, content, undefined, { pin: true });
        console.log('genesis doc');
        console.log(doc.content);
        return doc.id.toString();
    });
}
exports.createStream = createStream;
function viewStream(streamId, commitId, latest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (latest) {
            console.log("viewing stream %s latest commit", streamId);
        }
        else {
            console.log("viewing stream %s-%s", streamId, commitId);
        }
    });
}
exports.viewStream = viewStream;
function updateStream(streamId, description, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("updating stream %s-%s-%s", streamId, description, uri);
    });
}
exports.updateStream = updateStream;
