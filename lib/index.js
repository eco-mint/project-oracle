#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const stream = __importStar(require("./stream"));
const identity = __importStar(require("./identity"));
const program = new commander_1.Command();
program
    .name('eco-oracle')
    .version('0.0.1')
    .description('A CLI for administering EcoMint project oracles')
    .option('--ceramic <ceramicUri>', 'ceramic node uri', 'https://ceramic-clay.3boxlabs.com');
program.command('identity')
    .description('generate a new identity and output to the console')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield identity.createIdentity();
    console.log('created identity with seed: %s', seed);
}));
program.command('create')
    .description('create a new oracle stream')
    .option('--description <description>', 'description of the first commit', 'First commit for the Angry Teenagers NFT project oracle.')
    .option('--contentUri <uri>', 'uri for the first commit', 'https://angryteenagers.xyz')
    .action((description, uri) => __awaiter(void 0, void 0, void 0, function* () {
    const streamId = yield stream.createStream(description, uri);
    console.log('created stream with id: %s', streamId);
}));
program.command('view')
    .description('view an oracle and its data')
    .argument('<streamId>', 'stream id of the oracle')
    .option('--commit <commitId>', 'commit id to view')
    .option('--latest', 'view the latest commit')
    .action((streamId, { commitId, latest }) => __awaiter(void 0, void 0, void 0, function* () {
    yield stream.viewStream(streamId, commitId, latest);
}));
program.command('update')
    .description('update an oracle')
    .argument('<streamId>', 'stream id of the oracle')
    .option('--description <description>', 'commit description')
    .option('--uri <uri>', 'commit uri')
    .action((streamId, { description, uri }) => __awaiter(void 0, void 0, void 0, function* () {
    yield stream.updateStream(streamId, description, uri);
}));
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
