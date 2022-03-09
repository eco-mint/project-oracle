#!/usr/bin/env node

import {Command} from "commander";
import * as stream from "./stream";
import * as identity from "./identity";

const program = new Command();

program
    .name('eco-oracle')
    .version('0.0.1')
    .description("A CLI for administering EcoMint project oracles")
    .option('--ceramic <ceramicUri>', 'ceramic node uri', 'https://ceramic-clay.3boxlabs.com')
    .option('--identity <filePath>', 'reference to identity document used in ceramic auth');

program.command('identity')
    .description("generate a new identity and output to the console")
    .action(async () => {
        const seed: string = await identity.createIdentity()
        console.log("created identity with seed: %s", seed)
    });

program.command('create')
    .description("create a new oracle stream")
    .option('--schema <filePath>', 'specify a schema file for a new oracle', '../data/oracle-json.schema.json')
    .action(async (filePath) => {
        const streamId: string = await stream.createStream(filePath)
        console.log("created stream with id: %s", streamId)
    });

program.command('view')
    .description("view an oracle and its data")
    .argument('<streamId>', 'stream id of the oracle')
    .option('--commit <commitId>', 'commit id to view')
    .option('--latest', 'view the latest commit')
    .action(async (streamId, {commitId, latest}) => {
        await stream.viewStream(streamId, commitId, latest)
    });

program.command('update')
    .description("update an oracle")
    .argument('<streamId>', 'stream id of the oracle')
    .option('--description <description>', 'commit description')
    .option('--uri <uri>', 'commit uri')
    .action(async (streamId, {description, uri}) => {
        await stream.updateStream(streamId, description, uri)
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}