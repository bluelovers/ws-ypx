/**
 * Created by user on 2020/1/29.
 */

import { Arguments } from 'yargs'
import { ITSRequiredWith, ITSPickExtra } from 'ts-type';
import { Console2 } from 'debug-color2';

export interface IYPXArgumentsCore
{
	package: string[],
	quiet?: boolean,
	preferOffline?: boolean,
	cwd?: string,
	ignoreExisting?: boolean,
	noInstall?: boolean,
	/**
	 * for cli only
	 */
	debugBin?: boolean,
	/**
	 * for yargs only
	 * @deprecated
	 */
	help?: boolean,
}

export interface IYPXArguments extends Arguments<IYPXArgumentsCore>
{
	"--": string[]
}

export type IYPXArgumentsInput = ITSPickExtra<IYPXArguments, 'package', Exclude<keyof IYPXArguments, 'package'>>;

export interface IRuntimeCache
{
	readonly tmpDir: string,
	created: boolean,
	env?: {
		readonly [name: string]: string | undefined;
		readonly Path: string;
	},
	skipInstall: Record<string, string>,
	readonly console: Console2
}
