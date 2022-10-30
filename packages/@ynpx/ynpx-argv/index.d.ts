/**
 * Created by user on 2020/7/18.
 */
import yargs, { Arguments } from 'yargs';
export interface IYPXArgumentsCore {
    package: string[];
    quiet?: boolean;
    preferOffline?: boolean;
    cwd?: string;
    ignoreExisting?: boolean;
    noInstall?: boolean;
    /**
     * specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)
     */
    userconfig?: string;
    /**
     * for cli test only
     */
    debugBin?: boolean;
    /**
     * for yargs only
     * @deprecated
     */
    help?: boolean;
    debugMode?: boolean;
}
export interface IYPXArguments extends Arguments<IYPXArgumentsCore> {
    "--": string[];
}
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
    "--": string[];
    _: (string | number)[];
    $0: string;
};
export declare function parseArgvCore(inputArgv: string[]): yargs.Argv<Omit<{
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
}, "package"> & {
    package: string[];
    '--': string[];
}>;
export default parseArgv;
