/**
 * Created by user on 2020/1/29.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { newTemporary } from '../lib/createTemporaryDirectory';
import { crossSpawnOutput } from '../lib/util';
import initTemporaryPackage from '../lib/initTemporaryPackage';
import { normalize } from 'path';
import { runLocalBin } from './lib/util';
import { say } from 'cowsay';
import { __SELF_YPX_BIN } from './__root';
import { _lazyTestEnvironment, TEST_TIMEOUT } from './lib/helpers/setup';
import { testLog } from './lib/helpers/test-logger';

test(`test install`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	let cwd = actual.tmpDir;

	testLog(`target => `, cwd);

	await runLocalBin([
		'--debug-bin'
	], {
		cwd,
		stripAnsi: true,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			//console.dir(cp);

			// @ts-ignore
			testLog(`cp.exitCode =>`, cp.exitCode);
			// @ts-ignore
			assert.notStrictEqual(cp.exitCode, 1,
				`exit code should not be 1, got ${cp.exitCode}`);

			testLog(`output =>`, output);
			assert.strictEqual(normalize(output), normalize(__SELF_YPX_BIN),
				`output should be the ypx bin path`);

		})
	;

	await actual.remove();
});

test(`cowsay`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	let cwd = actual.tmpDir;

	testLog(`target => `, cwd);

	await runLocalBin([
		'-q',
		'--ignore-existing',
		'cowsay',
		'--',
		'test'
	], {
		cwd,
		stripAnsi: true,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			testLog(output);

			assert.ok(output.includes('< test >'),
				`output should contain '< test >'`);
			assert.ok(output.includes('(oo)\\_______'),
				`output should contain the cowsay cow pattern`);

			assert.strictEqual(output, say({
				text: 'test',
			}),
				`output should exactly match the expected cowsay output`);

		})
	;

	await actual.remove();
});

test(`command not found: speedtest`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	let cwd = actual.tmpDir;

	testLog(`target => `, cwd);

	await runLocalBin([
		'speedtest',
		'-q',
	], {
		cwd,
		stripAnsi: true,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			testLog(output);

			// @ts-ignore
			assert.strictEqual(cp.exitCode, 1,
				`exit code should be 1, got ${cp.exitCode}`);

			assert.ok(output.includes('command not found'),
				`output should contain 'command not found'`);

		})
		.finally(() => {
			return actual.remove()
		})
	;

	await actual.remove();
});
