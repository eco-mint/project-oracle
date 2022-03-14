# project-oracle
[Ceramic Stream](https://developers.ceramic.network/) based oracle tooling.

The project uses a set schema of an `OracleCommit` to represent an audit log for projects relating to the [Angry 
Teenagers NFT](http://angryteenagers.xyz/) initiative.

The oracle is intended to be used to represent updates about real-world project data such as satellite data, videos, 
images, or geological surveys and reports. Oracle updates are structured with three properties as follows:

- `createdAt`: a timestamp describing when the commit was published to Ceramic
- `description`: a human-readable text description of the commit
- `contentUri`: a URI that references the content data

By design, the stream references content outside the stream, which is assumed to be resolvable. This gives us the
greatest amount of flexibility in supporting project-updates of multiple types.

# Build & Install

For now the project is not published to NPM. Instead, you must build it locally. To do this run check out the project, 
cd to its directory, and run `npm run build` followed by `npm run local`.

After running, you should be able to access the binary via the `eco-oracle` command.

# CLI Documentation

The CLI exposes four main commands:
- `identity`: manage an identity used to authenticate streams
- `create`: create a stream
- `view`: view a stream and all its commits
- `update`: update a stream

## Identity

Usage is as follows:
```text
eco-oracle identity
```

which will return a [base64 encoded](https://en.wikipedia.org/wiki/Base64) string value representing a seed to a 
[`did:key`](https://developers.ceramic.network/reference/accounts/key-did/) value that will be used to authenticate writes to an oracle stream.

At present, this value must be set manually before build and install in the `stream.ts` file as the const value of
`knownEncodedSeed`.

**DO NOT** commit this value, if it is sensitive, to source control.

## Create

Creates a stream. You are not able to configure the schema, but you are able to provide a description and URI for
the first commit. If either is not supplied, default values will be used. Usage is as follows:

```text
eco-oracle create --description "test description" --contentUri "https://test.com"
```

A streamId will be returned as follows:

```text
created stream with id: kjzl6cwe1jw1498m98h5oqigd00ddtc2whs80hp45nlknqjkvwa75uusk1n62cc
```

## View

Views a stream. With this command you are able to do three possible things:

1. View information about a stream including its controllers and commits

```text
eco-oracle view kjzl6cwe1jw1498m98h5oqigd00ddtc2whs80hp45nlknqjkvwa75uusk1n62cc
```
2. View a specific commit id for a stream 

```text
eco-oracle view kjzl6cwe1jw1498m98h5oqigd00ddtc2whs80hp45nlknqjkvwa75uusk1n62cc --commitId k3y52l7qbv1fry9pa9oa0fwj8cg2n68lwn2gozhulk7tewsr8itkixnez2jor4npc
```

3. View information from the latest commit in a stream

```text
eco-oracle view kjzl6cwe1jw1498m98h5oqigd00ddtc2whs80hp45nlknqjkvwa75uusk1n62cc --latest
```

## Update

Updates a stream. You must provide both `--descripton` and `--contentUri` flags. Note, if you do not use the same
identity as was used to `create` the stream, your update will fail.

```text
eco-oracle update kjzl6cwe1jw1498m98h5oqigd00ddtc2whs80hp45nlknqjkvwa75uusk1n62cc --description "test description" --contentUri "https://test.com"
```