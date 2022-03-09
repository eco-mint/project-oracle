/**
 * Create a stream
 */
export async function createStream(filePath: string) {
    console.log("creating stream with schema %s", filePath)
}

export async function viewStream(streamId: string, id: string, latest: boolean) {
    if (latest) {
        console.log("viewing stream %s latest commit", streamId)
    } else {
        console.log("viewing stream %s-%s", streamId, id)
    }
}

export async function updateStream(streamId: string, description: string, uri: string) {
    console.log("updating stream %s-%s-%s", streamId, description, uri)
}