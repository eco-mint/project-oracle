#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
    .name('eco-oracle')
    .version('0.0.1')
    .description("A CLI for administering EcoMint project oracles")
    .option('-i', '--identity <file-path>', 'reference to identity document used in ceramic auth')
    .parse(process.argv);

program.command('create')
    .description("create a new oracle stream")
    .option('-s', '--schema <file-path>', 'specify a schema file for a new oracle');

program.command('view')
    .description("view an oracle and its data")
    .argument('<stream-id>', 'stream id of the oracle')
    .option('-c', '--commit <commit-id>', 'commit id to view')
    .option('-l', '--latest', 'view the latest commit');

program.command('update')
    .description("update an oracle")
    .argument('<stream-id>', 'stream id of the oracle')
    .option('-d', '--description', 'commit description')
    .option('-u', '--uri', 'commit uri');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));

if (!process.argv.slice(2).length) {
    program.outputHelp();
}