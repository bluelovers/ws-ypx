/**
 * createTemporaryDirectory 模組測試
 * createTemporaryDirectory Module Tests
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import createTemporaryDirectory, { _getCacheDir } from '../lib/createTemporaryDirectory';
import { dirname, normalize } from 'upath2';
import { testLog } from './lib/helpers/test-logger';
import { remove } from 'fs-extra';

test(`tmp`, async () =>
{
	let tmpdir = _getCacheDir();

	testLog(`[tmpdir]`, tmpdir);

	let actual = await createTemporaryDirectory();

	testLog(`[actual]`, actual);

	assert.strictEqual(dirname(actual), normalize(tmpdir),
		`temporary directory should be created under the cache directory`);

	if (normalize(actual).indexOf(normalize(tmpdir)) === 0)
	{
		testLog(`[removing]`, actual);
		await remove(actual);
	}
	else
	{
		testLog(`[not removing]`, actual);
	}
});


