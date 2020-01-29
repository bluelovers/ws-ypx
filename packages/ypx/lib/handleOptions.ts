import { IYPXArgumentsInput, IYPXArguments } from './types';
import { ITSPickExtra, ITSRequiredPick } from 'ts-type';
import { cloneDeep, defaultsDeep } from 'lodash';
import { resolve } from 'path';

export function handleOptions(argv: IYPXArgumentsInput): Required<IYPXArguments>
{
	let result = defaultsDeep(cloneDeep(argv), {
		package: [],
		_: [],
		"--": [],
		quiet: false,
		preferOffline: false,
		ignoreExisting: false,
		noInstall: false,
		cwd: argv.cwd ? argv.cwd : process.cwd(),
	}) as Required<IYPXArguments>;

	if (result.userconfig)
	{
		result.userconfig = resolve(result.cwd, result.userconfig);
	}

	return result;
}

export default handleOptions
