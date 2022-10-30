/**
 * Created by user on 2020/1/29.
 */

import { envObject as pathEnv } from '@yarn-tool/env-path'
import { IRuntimeCache } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';

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
