/**
 * Created by user on 2020/1/30.
 */

import { join } from "path";
import crossSpawnExtra, { SpawnOptions } from 'cross-spawn-extra';

export const local_bin = join(__dirname, '..', 'bin', 'ypx.js');

export function runLocalBin(argv: string[], options?: SpawnOptions)
{
	return crossSpawnExtra('node', [
		local_bin,
		...argv,
	], {
		...options,
		env: {
			...process.env,
			...options.env,
		}
	})
}
