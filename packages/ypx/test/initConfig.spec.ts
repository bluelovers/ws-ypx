/**
 * initConfig 模組測試
 * initConfig Module Tests
 *
 * 測試配置初始化相關功能
 * Tests configuration initialization functionality
 */

import { defaultConfig, normalizeConfig, handleOptionsToConfig, buildConfig } from '../lib/initConfig';
import { IYPXArguments } from '@ynpx/ynpx-argv';

describe('defaultConfig', () =>
{
	test('應回傳預設配置物件 / Should return default configuration object', () =>
	{
		const result = defaultConfig();

		expect(result).toMatchSnapshot({
			'enableGlobalCache': true,
			'disableSelfUpdateCheck': true,
			'preferOffline': true,
			'emoji': true,
		});
	});
});

describe('normalizeConfig', () =>
{
	test('應將 kebab-case 鍵名轉換為 camelCase / Should convert kebab-case keys to camelCase', () =>
	{
		const input = {
			'prefer-offline': true,
			'enable-global-cache': false,
		};
		const result = normalizeConfig({ ...input });

		expect(result).toMatchSnapshot({
			'preferOffline': true,
			'enableGlobalCache': false,
		});
		// 驗證 camelCase 鍵名存在
		expect(result).toHaveProperty('preferOffline');
		expect(result).toHaveProperty('enableGlobalCache');
	});

	test('應保留現有 camelCase 鍵名 / Should preserve existing camelCase keys', () =>
	{
		const input = {
			'preferOffline': true,
			'someOtherKey': 'value',
		};
		const result = normalizeConfig({ ...input });

		expect(result.preferOffline).toBe(true);
		expect(result.someOtherKey).toBe('value');
	});

	test('當 camelCase 和 kebab-case 同時存在時應合併 / Should merge when both camelCase and kebab-case exist', () =>
	{
		const input = {
			'prefer-offline': false,
			'preferOffline': true,
		};
		const result = normalizeConfig({ ...input });

		// camelCase 值應保留（因為 ??= 只在 undefined 時賦值）
		expect(result.preferOffline).toBe(true);
	});

	test('當 kebab-case 和 camelCase 同時存在且值不同時應保留 camelCase 值 / Should preserve camelCase value when both exist with different values', () =>
	{
		const input = {
			'enable-global-cache': true,
			'enableGlobalCache': false,
		};
		const result = normalizeConfig({ ...input });

		// camelCase 值應保留（false），因為 ??= 只在 undefined 時賦值
		expect(result.enableGlobalCache).toBe(false);
		// kebab-case 鍵名應被刪除
		expect(result).not.toHaveProperty('enable-global-cache');
	});

	test('當只有 kebab-case 存在時應建立 camelCase 並刪除原鍵名 / Should create camelCase and delete original when only kebab-case exists', () =>
	{
		const input = {
			'shamefully-hoist': true,
		};
		const result = normalizeConfig({ ...input });

		// 應建立 camelCase 鍵名
		expect(result).toHaveProperty('shamefullyHoist', true);
		// kebab-case 鍵名應被刪除
		expect(result).not.toHaveProperty('shamefully-hoist');
	});

	test('當 camelCase 已存在時不應覆蓋 / Should not overwrite existing camelCase', () =>
	{
		const input = {
			'my-custom-key': 'newValue',
			'myCustomKey': 'existingValue',
		};
		const result = normalizeConfig({ ...input });

		// 現有 camelCase 值應保留
		expect(result.myCustomKey).toBe('existingValue');
		// kebab-case 鍵名應被刪除
		expect(result).not.toHaveProperty('my-custom-key');
	});

	test('應處理多個混合鍵名 / Should handle multiple mixed keys', () =>
	{
		const input = {
			'prefer-offline': true,
			'enableGlobalCache': false,
			'shamefully-hoist': true,
			'emoji': true,
		};
		const result = normalizeConfig({ ...input });

		// 所有鍵名都應轉換為 camelCase
		expect(result.preferOffline).toBe(true);
		expect(result.enableGlobalCache).toBe(false);
		expect(result.shamefullyHoist).toBe(true);
		expect(result.emoji).toBe(true);

		// 不應存在 kebab-case 鍵名
		expect(result).not.toHaveProperty('prefer-offline');
		expect(result).not.toHaveProperty('shamefully-hoist');
	});
});

describe('handleOptionsToConfig', () =>
{
	test('應從 argv 提取 preferOffline 選項 / Should extract preferOffline option from argv', () =>
	{
		const argv = {
			preferOffline: true,
		} as IYPXArguments;
		const result = handleOptionsToConfig(argv);

		expect(result.preferOffline).toBe(true);
	});

	test('應從 argv 提取 shamefullyHoist 選項 / Should extract shamefullyHoist option from argv', () =>
	{
		const argv = {
			shamefullyHoist: true,
		} as IYPXArguments;
		const result = handleOptionsToConfig(argv);

		expect(result.shamefullyHoist).toBe(true);
	});

	test('應合併現有使用者配置 / Should merge with existing user config', () =>
	{
		const argv = {
			preferOffline: true,
		} as IYPXArguments;
		const userconfig = {
			customKey: 'customValue',
		};
		const result = handleOptionsToConfig(argv, userconfig);

		expect(result.preferOffline).toBe(true);
		expect(result.customKey).toBe('customValue');
	});

	test('當選項為 false 時不應加入配置 / Should not add option when false', () =>
	{
		const argv = {
			preferOffline: false,
			shamefullyHoist: false,
		} as IYPXArguments;
		const result = handleOptionsToConfig(argv);

		expect(result.preferOffline).toBeUndefined();
		expect(result.shamefullyHoist).toBeUndefined();
	});
});

describe('buildConfig', () =>
{
	test('應產生三種格式的配置 / Should generate three format configs', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		expect(result).toHaveProperty('rc');
		expect(result).toHaveProperty('npmrc');
		expect(result).toHaveProperty('yml');
	});

	test('產生的配置應包含換行符結尾 / Generated configs should end with newline', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		expect(result.rc.endsWith('\n')).toBe(true);
		expect(result.npmrc.endsWith('\n')).toBe(true);
		expect(result.yml.endsWith('\n')).toBe(true);
	});

	test('應合併預設配置與使用者配置 / Should merge default and user configs', () =>
	{
		const argv = {} as IYPXArguments;
		const userconfig = {
			customConfig: 'value',
		};
		const result = buildConfig(argv, userconfig);

		expect(result.rc).toContain('customConfig');
		expect(result.rc).toContain('enableGlobalCache');
	});

	test('應正確處理 argv 選項 / Should handle argv options correctly', () =>
	{
		const argv = {
			preferOffline: true,
			shamefullyHoist: true,
		} as IYPXArguments;
		const result = buildConfig(argv);

		expect(result.rc).toContain('preferOffline');
		expect(result.rc).toContain('shamefullyHoist');
		expect(result.yml).toContain('preferOffline');
		expect(result.yml).toContain('shamefullyHoist');
	});

	test('rc 格式應使用空格分隔 / rc format should use space separation', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		// 驗證 rc 格式使用空格分隔（非等號）
		const lines = result.rc.trim().split('\n');
		lines.forEach(line =>
		{
			expect(line).toMatch(/^\S+\s+\S+$/);
		});
	});

	test('npmrc 格式應使用等號分隔 / npmrc format should use equals separation', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		// 驗證 npmrc 格式使用等號分隔
		const lines = result.npmrc.trim().split('\n');
		lines.forEach(line =>
		{
			expect(line).toMatch(/^\S+=\S+$/);
		});
	});

	test('yml 格式應使用冒號加空格 / yml format should use colon and space', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		// 驗證 yml 格式使用 "key: value" 格式
		const lines = result.yml.trim().split('\n');
		lines.forEach(line =>
		{
			expect(line).toMatch(/^[a-zA-Z]+:\s+\S+$/);
		});
	});

	test('應生成快照匹配結果 / Should match snapshot', () =>
	{
		const argv = {
			preferOffline: true,
		} as IYPXArguments;
		const userconfig = {
			customSetting: 'test',
		};
		const result = buildConfig(argv, userconfig);

		expect(result).toMatchSnapshot();
	});
});
