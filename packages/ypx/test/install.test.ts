/**
 * Created by user on 2020/1/29.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { handleOptions } from '../lib/handleOptions';
import { createTemporaryDirectory, newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';
import { crossSpawnExtra } from 'cross-spawn-extra';
import { crossSpawnOutput } from '../lib/util';
import { initTemporaryPackage } from '../lib/initTemporaryPackage';
import { join } from 'path';
import { say } from 'cowsay';
import { __SELF_YPX_BIN } from './__root';
import { runLocalBin } from './lib/util';
import { installDependencies } from '../lib/installDependencies';
import { IRuntimeCache } from '../lib/types';
import { whichPackageManagerSync, EnumPackageManager, IPackageManager } from '@yarn-tool/detect-package-manager';
import { _createTestEnvironment, _expectCowsayFromCp } from './lib/helpers/cowsay-test-helper';
import newLogger from '../lib/logger';
import { _lazyTestEnvironment, TEST_TIMEOUT } from './lib/helpers/setup';
import { testLog } from './lib/helpers/test-logger';

test(`test install`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: true,
	});

	await tmpRunTsdxInstalled([
		'--debug-bin'
	])
		.then(cp => {

			let output = crossSpawnOutput(cp.output).replace(/^\s+|\s+$/g,'');

			//console.dir(cp);

			// @ts-ignore
			testLog(`cp.exitCode =>`, cp.exitCode);
			// @ts-ignore
			assert.notStrictEqual(cp.exitCode, 1,
				`exit code should not be 1, got ${cp.exitCode}`);

			testLog(`output =>`, output);
			assert.ok(output.includes('ypx_'),
				`output should contain ypx_`);

		})
	;

	// await actual.remove();

});

test(`cowsay`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		// autoInstallTsdx: true,
	});

	await tmpRunTsdxLocal([
		'-q',
		'--ignore-existing',
		'cowsay',
		'--',
		'test'
	])
		.then(cp => {

			return _expectCowsayFromCp({
				cp,
				text: 'test',
			})

		})
	;

	await actual.remove();
});

test(`cowsay@latest`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	await tmpRunTsdxLocal([
		'-q',
		'--ignore-existing',
		'cowsay@latest',
		'--',
		'test'
	])
		.then(cp => {

			return _expectCowsayFromCp({
				cp,
				text: 'test',
			})

		})
	;

	await actual.remove();
});

test(`command not found: speedtest`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	await tmpRunTsdxLocal([
		'speedtest',
		'--',
		'-q',
	])
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			testLog(output);

			// @ts-ignore
			assert.strictEqual(cp.exitCode, 1,
				`exit code should be 1, got ${cp.exitCode}`);

			assert.match(output, /command not found|Couldn't find a package/,
				`output should contain a command-not-found message`);

		})
		.finally(() => {
			return actual.remove()
		})
	;

	await actual.remove();
});
