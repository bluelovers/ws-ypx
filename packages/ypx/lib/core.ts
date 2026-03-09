/**
 * Created by user on 2026/3/4.
 */
import { initTemporaryPackage } from './initTemporaryPackage';
import { installDependencies } from './installDependencies';
import { inspect } from 'util';
import { IRuntimeCache, IYPXArgumentsInput } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';

export async function _processIfNeedInitTmpPkg(argv: Required<IYPXArguments>, runtime: IRuntimeCache)
{
	if (runtime.needInitTmpPkg)
	{
		console.time(`installed`);

		await initTemporaryPackage(runtime.tmpDir, argv)
			.tapCatch(e =>
			{
				console.error(`failed create temp package, ${runtime.tmpDir}`)
			})
			.tap(() =>
			{
				console.debug(`[temp package]`, runtime.tmpDir);
			})
		;

		await installDependencies(argv, runtime);

		if (Object.keys(runtime.skipInstall).length)
		{
			console.info(`skip install`, inspect(runtime.skipInstall), `or maybe u wanna use --ignore-existing`)
		}

		console.timeEnd(`installed`);

		runtime.needInitTmpPkg = false;
	}
}
