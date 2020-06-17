/**
 * Created by user on 2020/1/29.
 */

import { pathEnv } from 'path-env'
import { IYPXArguments, IRuntimeCache } from './types';

export function handleEnv(argv: IYPXArguments, runtime: IRuntimeCache, _env?): IRuntimeCache["env"]
{
	let paths = pathEnv(_env || runtime.env || process.env)
		.path.append([runtime.tmpDir])
	;

	let env = paths.get.env();

	// @ts-ignore
	env.path = env.Path = env.PATH = paths.path.get.string();

	return env as any
}

export default handleEnv
