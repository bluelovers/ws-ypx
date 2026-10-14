/**
 * handleEnv 模組測試
 * handleEnv Module Tests
 *
 * 測試環境變數處理相關功能
 * Tests environment variable handling functionality
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { handleEnv } from '../lib/handleEnv';
import { IRuntimeCache } from '../lib/types';
import { IYPXArguments } from '@ynpx/ynpx-argv';

describe('handleEnv', () =>
{
	/**
	 * 建立測試用的 IYPXArguments 物件
	 * Create test IYPXArguments object
	 */
	const _createMockArgv = (): IYPXArguments =>
	{
		return {
			package: ['test-package'],
			_: [],
			'--': [],
			$0: 'ypx',
		} as IYPXArguments;
	};

	/**
	 * 建立測試用的 IRuntimeCache 物件
	 * Create test IRuntimeCache object
	 */
	const _createMockRuntime = (overrides?: Partial<IRuntimeCache>): IRuntimeCache =>
	{
		return {
			tmpDir: '/tmp/test-ypx-dir',
			created: true,
			skipInstall: {},
			console: {} as any,
			needInitTmpPkg: false,
			...overrides,
		} as IRuntimeCache;
	};

	test('應將臨時目錄加入 PATH / Should add temporary directory to PATH', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();
		const originalPath = '/usr/bin:/usr/local/bin';

		const result = handleEnv(argv, runtime, {
			PATH: originalPath,
		});

		// 驗證 PATH 包含原始路徑和臨時目錄
		assert.ok(String(result.PATH).includes('/tmp/test-ypx-dir'),
			`PATH 應包含臨時目錄 / PATH should contain the temporary directory`);
		assert.ok(String(result.PATH).includes(originalPath),
			`PATH 應包含原始路徑 / PATH should contain the original path`);
	});

	test('應統一設定 path、Path、PATH 三種變數名稱 / Should normalize path, Path, and PATH variables', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin',
		});

		// 驗證三種變數名稱都被設定為相同值
		assert.strictEqual(result.path, result.PATH,
			`path 應與 PATH 相同 / path should equal PATH`);
		assert.strictEqual(result.Path, result.PATH,
			`Path 應與 PATH 相同 / Path should equal PATH`);
		assert.strictEqual(result.path, result.Path,
			`path 應與 Path 相同 / path should equal Path`);
	});

	test('應設定 NPM_CONFIG_UPDATE_NOTIFIER 為 false / Should set NPM_CONFIG_UPDATE_NOTIFIER to false', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime);

		assert.strictEqual(result.NPM_CONFIG_UPDATE_NOTIFIER, false,
			`NPM_CONFIG_UPDATE_NOTIFIER 應為 false / NPM_CONFIG_UPDATE_NOTIFIER should be false`);
	});

	test('應設定 NO_UPDATE_NOTIFIER 為 true / Should set NO_UPDATE_NOTIFIER to true', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin',
		});

		// 使用屬性存取方式驗證，因為環境變數物件可能有特殊行為
		assert.strictEqual(result.NO_UPDATE_NOTIFIER, true,
			`NO_UPDATE_NOTIFIER 應為 true / NO_UPDATE_NOTIFIER should be true`);
		assert.ok('NO_UPDATE_NOTIFIER' in result,
			`應存在 NO_UPDATE_NOTIFIER 鍵 / NO_UPDATE_NOTIFIER key should exist`);
	});

	test('應使用 runtime.env 當 _env 未提供時 / Should use runtime.env when _env is not provided', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime({
			env: {
				PATH: '/custom/path',
				CUSTOM_VAR: 'value',
			} as any,
		});

		const result = handleEnv(argv, runtime);

		assert.ok(String(result.PATH).includes('/tmp/test-ypx-dir'),
			`PATH 應包含臨時目錄 / PATH should contain the temporary directory`);
		assert.ok(String(result.PATH).includes('/custom/path'),
			`PATH 應包含 runtime.env 的路徑 / PATH should contain the runtime.env path`);
		assert.strictEqual(result.CUSTOM_VAR, 'value',
			`CUSTOM_VAR 應被保留 / CUSTOM_VAR should be preserved`);
	});

	test('應使用 _env 參數覆寫 runtime.env / Should use _env parameter to override runtime.env', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime({
			env: {
				PATH: '/runtime/path',
				RUNTIME_VAR: 'runtime',
			} as any,
		});
		const overrideEnv = {
			PATH: '/override/path',
			OVERRIDE_VAR: 'override',
		};

		const result = handleEnv(argv, runtime, overrideEnv);

		assert.ok(String(result.PATH).includes('/override/path'),
			`PATH 應包含覆寫路徑 / PATH should contain the override path`);
		assert.strictEqual(result.OVERRIDE_VAR, 'override',
			`OVERRIDE_VAR 應為 override / OVERRIDE_VAR should be override`);
		// runtime.env 應該被 _env 覆寫
		assert.strictEqual(result.RUNTIME_VAR, undefined,
			`runtime.env 的變數不應出現在結果中 / runtime.env variables should not appear in the result`);
	});

	test('當未提供環境變數時應使用 process.env / Should use process.env when no env provided', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime);

		// 驗證結果包含臨時目錄
		assert.ok(String(result.PATH).includes('/tmp/test-ypx-dir'),
			`PATH 應包含臨時目錄 / PATH should contain the temporary directory`);
		// 驗證結果包含 process.env 的內容
		assert.ok('PATH' in result,
			`應存在 PATH 鍵 / PATH key should exist`);
	});

	test('應保留原有環境變數 / Should preserve existing environment variables', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();
		const customEnv = {
			PATH: '/usr/bin',
			HOME: '/home/user',
			USER: 'testuser',
			CUSTOM_VAR: 'custom_value',
		};

		const result = handleEnv(argv, runtime, customEnv);

		assert.strictEqual(result.HOME, '/home/user',
			`HOME 應被保留 / HOME should be preserved`);
		assert.strictEqual(result.USER, 'testuser',
			`USER 應被保留 / USER should be preserved`);
		assert.strictEqual(result.CUSTOM_VAR, 'custom_value',
			`CUSTOM_VAR 應被保留 / CUSTOM_VAR should be preserved`);
	});

	test('應正確處理 Windows 路徑分隔符 / Should handle Windows path separators correctly', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime({
			tmpDir: 'C:\\Users\\test\\tmp',
		});
		const originalPath = 'C:\\Windows\\System32;C:\\Program Files\\Node';

		const result = handleEnv(argv, runtime, {
			PATH: originalPath,
		});

		assert.ok(String(result.PATH).includes('C:\\Users\\test\\tmp'),
			`PATH 應包含 Windows 臨時目錄 / PATH should contain the Windows temporary directory`);
	});

	test('應處理空 PATH 環境變數 / Should handle empty PATH environment variable', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '',
		});

		// 即使原始 PATH 為空，也應該包含臨時目錄
		assert.ok(String(result.PATH).includes('/tmp/test-ypx-dir'),
			`PATH 應包含臨時目錄 / PATH should contain the temporary directory`);
	});

	test('產生的環境變數應符合快照 / Should match snapshot', (t) =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin:/usr/local/bin',
			HOME: '/home/test',
		});

		// 驗證特定屬性
		assert.strictEqual(result.NPM_CONFIG_UPDATE_NOTIFIER, false,
			`NPM_CONFIG_UPDATE_NOTIFIER 應為 false / NPM_CONFIG_UPDATE_NOTIFIER should be false`);
		assert.strictEqual(result.NO_UPDATE_NOTIFIER, true,
			`NO_UPDATE_NOTIFIER 應為 true / NO_UPDATE_NOTIFIER should be true`);

		// 使用 snapshot 比對完整結構
		t.assert.snapshot(result);
	});
});
