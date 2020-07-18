import Bluebird from 'bluebird';
export declare function getCacheDir(): string;
export declare function createTemporaryDirectory(): Bluebird<string>;
export declare function newTemporary(): Promise<{
    readonly tmpDir: string;
    remove(): Promise<void>;
}>;
export default createTemporaryDirectory;
