/**
 * Created by user on 2020/1/29.
 */

import { ITSPickExtra } from 'ts-type';
import { Console2 } from 'debug-color2';
import { IYPXArguments } from '@ynpx/ynpx-argv';

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
