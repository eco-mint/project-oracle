/**
 * Create a stream
 */
export declare function createStream(filePath: string): Promise<string>;
export declare function viewStream(streamId: string, commitId: string, latest: boolean): Promise<void>;
export declare function updateStream(streamId: string, description: string, uri: string): Promise<void>;
