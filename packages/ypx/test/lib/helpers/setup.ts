/**
 * Created by user on 2026/3/9.
 */
import { before } from 'node:test';
import type { TestContext } from 'node:test';

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
import { testLog, testLogGray } from './test-logger';

/**
 * 整合測試的逾時時間（60 分鐘）
 * Timeout for integration tests (60 minutes)
 *
 * 由於需要安裝套件，設置較長的逾時時間（原為 jest.setTimeout）
 * Longer timeout needed for package installation (formerly jest.setTimeout)
 */
export const TEST_TIMEOUT = 60 * 60 * 1000;

export let _npmClient: IPackageManager;
export let _runtime = {
	console,
	npmClient: null as IPackageManager,
} satisfies Partial<IRuntimeCache>;

/**
 * 建立測試環境，並註冊測試結束後的清理動作
 * Create a test environment and register post-test cleanup
 *
 * 以 TestContext.after 取代原本的 afterThis（jest-after-this）
 * Uses TestContext.after in place of the former afterThis (jest-after-this)
 *
 * @param {TestContext} t - 測試上下文 / Test context
 */
export async function _lazyTestEnvironment(t: TestContext, options?: {
	autoInstallTsdx?: boolean,
})
{
	const tmp = await _createTestEnvironment();

	t.after(() => {
		testLog(`Cleaning up test environment...`);
		tmp.remove()
	});

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
			testLogGray(`[cwd]`, tmp.tmpDir);
			testLogGray(`[tmpRunTsdxInstalled]`, argv.join(' '));
			return crossSpawnExtra('./node_modules/.bin/ynpx', argv, {
				cwd: tmp.tmpDir,
				stripAnsi: true,
				env: process.env,
			})
		},
		tmpRunTsdxLocal(argv: string[], options?: SpawnOptions)
		{
			testLogGray(`[cwd]`, tmp.tmpDir);
			testLogGray(`[tmpRunTsdxLocal]`, argv.join(' '));
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
		testLog(`Installing tsdx...`);
		await ret.tmpInstallTsdx();
	}

	return ret;
}

/*
 * 原為 beforeAll（Jest），改用 node:test 的 before
 * Was beforeAll (Jest); switched to node:test's before
 */
before(() => {
	_npmClient = whichPackageManagerSync();
	_runtime.npmClient = _npmClient;
});
