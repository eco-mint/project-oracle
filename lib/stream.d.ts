/**
 * Create a stream with a description and uri
 */
export declare function createStream(description: string, contentUri: string): Promise<string>;
/**
 * View a stream
 * Able to do three possible things:
 * (1) view information about a stream including its controllers and commits
 * (2) view a specific commit id for a stream
 * (3) view information from the latest commit in a stream
 */
export declare function viewStream(streamId: string, commitId: string, latest: boolean): Promise<void>;
/**
 * Update a stream with a description and uri
 */
export declare function updateStream(streamId: string, description: string, contentUri: string): Promise<void>;
