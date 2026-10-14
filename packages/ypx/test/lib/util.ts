/**
 * Created by user on 2020/1/30.
 */

import { join } from "path";
import { crossSpawnExtra, SpawnOptions } from 'cross-spawn-extra';
import { __SELF_YPX_BIN } from '../__root';
import { console } from 'debug-color2';
import { testLogGray } from "./helpers/test-logger";

export function runLocalBin(argv: string[], options?: SpawnOptions)
{
	testLogGray(`[cwd]`, options?.cwd);
	testLogGray(`[runLocalBin]`, argv.join(' '));
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
