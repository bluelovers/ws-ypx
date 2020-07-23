/**
 * Created by user on 2020/7/18.
 */
import yargs from 'yargs';
export declare function parseArgv(inputArgv: string[]): {
    [x: string]: unknown;
    quiet: boolean;
    preferOffline: boolean;
    ignoreExisting: boolean;
    noInstall: boolean;
    userconfig: string;
    debugBin: boolean;
    debugMode: boolean;
    package: string[];
    '--': string[];
    _: string[];
    $0: string;
};
export declare function parseArgvCore(inputArgv: string[]): yargs.Argv<Pick<{
    package: string;
} & {
    quiet: boolean;
} & {
    ignoreExisting: boolean;
} & {
    noInstall: boolean;
} & {
    preferOffline: boolean;
} & {
    debugBin: boolean;
} & {
    debugMode: boolean;
} & {
    userconfig: string;
}, "quiet" | "preferOffline" | "ignoreExisting" | "noInstall" | "userconfig" | "debugBin" | "debugMode"> & {
    package: string[];
    '--': string[];
}>;
export default parseArgv;
