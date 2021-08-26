/**
 * Created by user on 2020/1/30.
 */
export declare class YpxError extends Error {
    readonly exitCode?: number;
    name: string;
    constructor(exitCode?: number);
}
