/**
 * handleEnv 模組測試
 * handleEnv Module Tests
 *
 * 測試環境變數處理相關功能
 * Tests environment variable handling functionality
 */

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
		expect(result.PATH).toContain('/tmp/test-ypx-dir');
		expect(result.PATH).toContain(originalPath);
	});

	test('應統一設定 path、Path、PATH 三種變數名稱 / Should normalize path, Path, and PATH variables', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin',
		});

		// 驗證三種變數名稱都被設定為相同值
		expect(result.path).toBe(result.PATH);
		expect(result.Path).toBe(result.PATH);
		expect(result.path).toBe(result.Path);
	});

	test('應設定 NPM_CONFIG_UPDATE_NOTIFIER 為 false / Should set NPM_CONFIG_UPDATE_NOTIFIER to false', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime);

		expect(result).toHaveProperty('NPM_CONFIG_UPDATE_NOTIFIER', false);
	});

	test('應設定 NO_UPDATE_NOTIFIER 為 true / Should set NO_UPDATE_NOTIFIER to true', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin',
		});

		// 使用屬性存取方式驗證，因為環境變數物件可能有特殊行為
		expect(result.NO_UPDATE_NOTIFIER).toBe(true);
		expect('NO_UPDATE_NOTIFIER' in result).toBe(true);
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

		expect(result.PATH).toContain('/tmp/test-ypx-dir');
		expect(result.PATH).toContain('/custom/path');
		expect(result.CUSTOM_VAR).toBe('value');
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

		expect(result.PATH).toContain('/override/path');
		expect(result.OVERRIDE_VAR).toBe('override');
		// runtime.env 應該被 _env 覆寫
		expect(result.RUNTIME_VAR).toBeUndefined();
	});

	test('當未提供環境變數時應使用 process.env / Should use process.env when no env provided', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime);

		// 驗證結果包含臨時目錄
		expect(result.PATH).toContain('/tmp/test-ypx-dir');
		// 驗證結果包含 process.env 的內容
		expect(result).toHaveProperty('PATH');
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

		expect(result.HOME).toBe('/home/user');
		expect(result.USER).toBe('testuser');
		expect(result.CUSTOM_VAR).toBe('custom_value');
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

		expect(result.PATH).toContain('C:\\Users\\test\\tmp');
	});

	test('應處理空 PATH 環境變數 / Should handle empty PATH environment variable', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '',
		});

		// 即使原始 PATH 為空，也應該包含臨時目錄
		expect(result.PATH).toContain('/tmp/test-ypx-dir');
	});

	test('產生的環境變數應符合快照 / Should match snapshot', () =>
	{
		const argv = _createMockArgv();
		const runtime = _createMockRuntime();

		const result = handleEnv(argv, runtime, {
			PATH: '/usr/bin:/usr/local/bin',
			HOME: '/home/test',
		});

		// 驗證特定屬性
		expect(result.NPM_CONFIG_UPDATE_NOTIFIER).toBe(false);
		expect(result.NO_UPDATE_NOTIFIER).toBe(true);

		// 使用 snapshot 比對完整結構
		expect(result).toMatchSnapshot();
	});
});
