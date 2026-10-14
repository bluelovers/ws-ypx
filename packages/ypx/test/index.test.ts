/**
 * Created by user on 2020/1/27.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import handleOptions from '../lib/handleOptions';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import { initTemporaryPackage } from '../lib/initTemporaryPackage';
import { _lazyTestEnvironment, TEST_TIMEOUT } from './lib/helpers/setup';

test(`handleOptions`, (t) =>
{
	let actual = handleOptions({
		cwd: '__dirname',
	} as any);

	assert.ok('package' in actual,
		`應存在 package 鍵`);
	assert.ok('quiet' in actual,
		`應存在 quiet 鍵`);
	assert.ok('preferOffline' in actual,
		`應存在 preferOffline 鍵`);

	t.assert.snapshot(actual);
});

test(`test temp dir`, { timeout: TEST_TIMEOUT }, async (t) =>
{
	const { tmp: actual } = await _lazyTestEnvironment(t, {
		autoInstallTsdx: false,
	});

	assert.ok(actual.tmpDir.includes('ypx_'),
		`臨時目錄名稱應包含 ypx_`);
	assert.ok(pathExistsSync(actual.tmpDir),
		`臨時目錄應存在`);
	assert.strictEqual(typeof actual.remove, 'function',
		`remove 應為函式`);

	await initTemporaryPackage(actual.tmpDir, {} as any);

	assert.ok(pathExistsSync(join(actual.tmpDir, '.yarnrc')),
		`應建立 .yarnrc`);
	assert.ok(pathExistsSync(join(actual.tmpDir, '.yarnrc.yml')),
		`應建立 .yarnrc.yml`);
	// assert.ok(pathExistsSync(join(actual.tmpDir, 'yarn.lock')), `應建立 yarn.lock / yarn.lock should be created`);
	assert.ok(pathExistsSync(join(actual.tmpDir, 'package.json')),
		`應建立 package.json`);

	await assert.doesNotReject(() => actual.remove(),
		`remove 不應 reject`);

	assert.ok(!pathExistsSync(actual.tmpDir),
		`臨時目錄應已被刪除`);
});
