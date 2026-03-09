/**
 * Created by user on 2026/3/9.
 */
import { _createTestEnvironment } from './cowsay-test-helper';
import { IPackageManager, whichPackageManagerSync } from '@yarn-tool/detect-package-manager';
import { consoleLogger as console } from 'debug-color2/logger';
import { IRuntimeCache } from '../../../lib/types';
import { crossSpawnExtra, SpawnOptions } from 'cross-spawn-extra';
import { installDependencies } from '../../../lib/installDependencies';
import { IYPXArguments } from '@ynpx/ynpx-argv';
import { runLocalBin } from '../util';
import { __ROOT } from '../../__root';
import { normalize } from 'upath2';
import { afterThis } from 'jest-after-this';

jest.setTimeout(60 * 60 * 1000);

export let _npmClient: IPackageManager;
export let _runtime = {
	console,
	npmClient: null as IPackageManager,
} satisfies Partial<IRuntimeCache>;

export async function _lazyTestEnvironment(options?: {
	autoInstallTsdx?: boolean,
})
{
	const tmp = await _createTestEnvironment();

	afterThis(() => tmp.remove());

	const runtime = {
		..._runtime,
		tmpDir: tmp.tmpDir,
	} satisfies Partial<IRuntimeCache> as IRuntimeCache;

	const argv = {
		cwd: tmp.tmpDir,
		env: process.env,
	} satisfies Partial<IYPXArguments>;

	const ret = {
		tmp,
		runtime,
		argv,
		tmpInstallTsdx()
		{
			return installDependencies({
				ignoreExisting: true,
				...argv,
				package: [
					`ynpx`,
					// `file:///${normalize(__ROOT)}`,
				],
			}, runtime);
		},
		tmpRunTsdxInstalled(argv: string[])
		{
			console.gray.log(`[cwd]`, tmp.tmpDir);
			console.gray.log(`[tmpRunTsdxInstalled]`, argv.join(' '));
			return crossSpawnExtra('./node_modules/.bin/ynpx', argv, {
				cwd: tmp.tmpDir,
				stripAnsi: true,
				env: process.env,
			})
		},
		tmpRunTsdxLocal(argv: string[], options?: SpawnOptions)
		{
			return runLocalBin(argv, {
				cwd: tmp.tmpDir,
				stripAnsi: true,
				env: process.env,
				...options,
			})
		},
	};

	if (options.autoInstallTsdx)
	{
		await ret.tmpInstallTsdx();
	}

	return ret;
}

beforeAll(() => {
	_npmClient = whichPackageManagerSync();
	_runtime.npmClient = _npmClient;
});
