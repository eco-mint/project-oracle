#!/usr/bin/env node

import { Command } from 'commander'
import * as stream from './stream'
import * as identity from './identity'

const program = new Command()

program
  .name('eco-oracle')
  .version('0.0.1')
  .description('A CLI for administering EcoMint project oracles')
  .option('--ceramic <ceramicUri>', 'ceramic node uri', 'https://ceramic-clay.3boxlabs.com')

program.command('identity')
  .description('generate a new identity and output to the console')
  .action(async () => {
    const seed: string = await identity.createIdentity()
    console.log('created identity with seed: %s', seed)
  })

program.command('create')
  .description('create a new oracle stream')
  .option('--description <description>', 'description for the first commit', 'First commit for the Angry Teenagers NFT project oracle.')
  .option('--contentUri <contentUri>', 'content uri for the first commit', 'https://angryteenagers.xyz')
  .action(async ({ description, contentUri }) => {
    const streamId: string = await stream.createStream(description, contentUri)
    console.log('created stream with id: %s', streamId)
  })

program.command('view')
  .description('view an oracle and its data')
  .argument('<streamId>', 'stream id of the oracle')
  .option('--commitId <commitId>', 'commit id to view')
  .option('--latest', 'view the latest commit')
  .action(async (streamId, { commitId, latest }) => {
    await stream.viewStream(streamId, commitId, latest)
  })

program.command('update')
  .description('update an oracle')
  .argument('<streamId>', 'stream id of the oracle')
  .option('--description <description>', 'description for the commit')
  .option('--contentUri <contentUri>', 'content uri for the commit')
  .action(async (streamId, { description, contentUri }) => {
    await stream.updateStream(streamId, description, contentUri)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
