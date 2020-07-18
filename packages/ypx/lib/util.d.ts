/// <reference types="node" />
/**
 * Created by user on 2020/1/30.
 */
import { SpawnSyncReturns, CrossSpawnExtra } from 'cross-spawn-extra/core';
export declare const stripAnsi: typeof CrossSpawnExtra.stripAnsi;
export declare function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options?: {
    clearEol?: boolean;
    stripAnsi?: boolean;
}): string;
