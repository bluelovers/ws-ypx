import { IYPXArgumentsInput, IYPXArguments } from './types';
import { ITSPickExtra, ITSRequiredPick } from 'ts-type';
import { cloneDeep, defaultsDeep } from 'lodash';

export function handleOptions(argv: IYPXArgumentsInput): Required<IYPXArguments>
{
	return defaultsDeep(cloneDeep(argv), {
		package: [],
		_: [],
		"--": [],
		quiet: false,
		preferOffline: false,
		ignoreExisting: false,
		noInstall: false,
		cwd: argv.cwd ? argv.cwd : process.cwd(),
	})
}

export default handleOptions
