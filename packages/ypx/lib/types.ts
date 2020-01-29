/**
 * Created by user on 2020/1/29.
 */

import { Arguments } from 'yargs-parser-extra';
import { ITSRequiredWith, ITSPickExtra } from 'ts-type';

export interface IYPXArgumentsCore
{
	package: string[],
	quiet?: boolean,
	preferOffline?: boolean,
	cwd?: string,
	ignoreExisting?: boolean,
	noInstall?: boolean,
	help?: boolean,
}

export interface IYPXArguments extends Arguments<IYPXArgumentsCore>
{
}

export type IYPXArgumentsInput = ITSPickExtra<IYPXArguments, 'package', Exclude<keyof IYPXArguments, 'package'>>;

export interface IRuntimeCache
{
	tmpDir: string,
	created: boolean,
	env?: {
		readonly [name: string]: string | undefined;
		readonly Path: string;
	},
	skipInstall: Record<string, string>
}
