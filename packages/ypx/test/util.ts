/**
 * Created by user on 2020/1/30.
 */

import { join } from "path";
import crossSpawnExtra, { SpawnOptions } from 'cross-spawn-extra';
import { __SELF_YPX_BIN } from './__root';

export function runLocalBin(argv: string[], options?: SpawnOptions)
{
	return crossSpawnExtra('node', [
		__SELF_YPX_BIN,
		...argv,
	], {
		...options,
		env: {
			...process.env,
			...options.env,
		}
	})
}
