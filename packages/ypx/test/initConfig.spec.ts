/**
 * initConfig 模組測試
 * initConfig Module Tests
 *
 * 測試配置初始化相關功能
 * Tests configuration initialization functionality
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { defaultConfig, normalizeConfig, handleOptionsToConfig, buildConfig } from '../lib/initConfig';
import { IYPXArguments } from '@ynpx/ynpx-argv';

describe('defaultConfig', () =>
{
	test('應回傳預設配置物件', (t) =>
	{
		const result = defaultConfig();

		/*
		 * 原 Jest 的 toMatchSnapshot(propertyMatchers) 會先以 matcher 驗證指定欄位，
		 * 再以 snapshot 比對其餘結構；此處以 partialDeepStrictEqual + snapshot 取代
		 * Jest's toMatchSnapshot(propertyMatchers) first verifies the given fields with
		 * matchers, then compares the rest via snapshot; replaced with
		 * partialDeepStrictEqual + snapshot here
		 */
		assert.partialDeepStrictEqual(result, {
			'enableGlobalCache': true,
			'disableSelfUpdateCheck': true,
			'preferOffline': true,
			'emoji': true,
		});

		t.assert.snapshot(result);
	});
});

describe('normalizeConfig', () =>
{
	test('應將 kebab-case 鍵名轉換為 camelCase', (t) =>
	{
		const input = {
			'prefer-offline': true,
			'enable-global-cache': false,
		};
		const result = normalizeConfig({ ...input });

		assert.partialDeepStrictEqual(result, {
			'preferOffline': true,
			'enableGlobalCache': false,
		});

		// 驗證 camelCase 鍵名存在
		assert.ok('preferOffline' in result,
			`應存在 preferOffline 鍵`);
		assert.ok('enableGlobalCache' in result,
			`應存在 enableGlobalCache 鍵`);

		t.assert.snapshot(result);
	});

	test('應保留現有 camelCase 鍵名 / Should preserve existing camelCase keys', () =>
	{
		const input = {
			'preferOffline': true,
			'someOtherKey': 'value',
		};
		const result = normalizeConfig({ ...input });

		assert.strictEqual(result.preferOffline, true,
			`preferOffline 應為 true`);
		assert.strictEqual(result.someOtherKey, 'value',
			`someOtherKey 應為 value`);
	});

	test('當 camelCase 和 kebab-case 同時存在時應合併', () =>
	{
		const input = {
			'prefer-offline': false,
			'preferOffline': true,
		};
		const result = normalizeConfig({ ...input });

		// camelCase 值應保留（因為 ??= 只在 undefined 時賦值）
		assert.strictEqual(result.preferOffline, true,
			`preferOffline 應保留 camelCase 值`);
	});

	test('當 kebab-case 和 camelCase 同時存在且值不同時應保留 camelCase 值 / Should preserve camelCase value when both exist with different values', () =>
	{
		const input = {
			'enable-global-cache': true,
			'enableGlobalCache': false,
		};
		const result = normalizeConfig({ ...input });

		// camelCase 值應保留（false），因為 ??= 只在 undefined 時賦值
		assert.strictEqual(result.enableGlobalCache, false,
			`enableGlobalCache 應保留 camelCase 值`);
		// kebab-case 鍵名應被刪除
		assert.ok(!('enable-global-cache' in result),
			`kebab-case 鍵名應被刪除 / kebab-case key should be removed`);
	});

	test('當只有 kebab-case 存在時應建立 camelCase 並刪除原鍵名', () =>
	{
		const input = {
			'shamefully-hoist': true,
		};
		const result = normalizeConfig({ ...input });

		// 應建立 camelCase 鍵名
		assert.strictEqual(result.shamefullyHoist, true,
			`shamefullyHoist 應為 true`);
		// kebab-case 鍵名應被刪除
		assert.ok(!('shamefully-hoist' in result),
			`kebab-case 鍵名應被刪除`);
	});

	test('當 camelCase 已存在時不應覆蓋', () =>
	{
		const input = {
			'my-custom-key': 'newValue',
			'myCustomKey': 'existingValue',
		};
		const result = normalizeConfig({ ...input });

		// 現有 camelCase 值應保留
		assert.strictEqual(result.myCustomKey, 'existingValue',
			`myCustomKey 應保留既有值`);
		// kebab-case 鍵名應被刪除
		assert.ok(!('my-custom-key' in result),
			`kebab-case 鍵名應被刪除`);
	});

	test('應處理多個混合鍵名', () =>
	{
		const input = {
			'prefer-offline': true,
			'enableGlobalCache': false,
			'shamefully-hoist': true,
			'emoji': true,
		};
		const result = normalizeConfig({ ...input });

		// 所有鍵名都應轉換為 camelCase
		assert.strictEqual(result.preferOffline, true,
			`preferOffline 應為 true`);
		assert.strictEqual(result.enableGlobalCache, false,
			`enableGlobalCache 應為 false`);
		assert.strictEqual(result.shamefullyHoist, true,
			`shamefullyHoist 應為 true`);
		assert.strictEqual(result.emoji, true,
			`emoji 應為 true`);

		// 不應存在 kebab-case 鍵名
		assert.ok(!('prefer-offline' in result),
			`不應存在 prefer-offline 鍵`);
		assert.ok(!('shamefully-hoist' in result),
			`不應存在 shamefully-hoist 鍵`);
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

		assert.strictEqual(result.preferOffline, true,
			`preferOffline 應為 true`);
	});

	test('應從 argv 提取 shamefullyHoist 選項', () =>
	{
		const argv = {
			shamefullyHoist: true,
		} as IYPXArguments;
		const result = handleOptionsToConfig(argv);

		assert.strictEqual(result.shamefullyHoist, true,
			`shamefullyHoist 應為 true`);
	});

	test('應合併現有使用者配置', () =>
	{
		const argv = {
			preferOffline: true,
		} as IYPXArguments;
		const userconfig = {
			customKey: 'customValue',
		};
		const result = handleOptionsToConfig(argv, userconfig);

		assert.strictEqual(result.preferOffline, true,
			`preferOffline 應為 true`);
		assert.strictEqual(result.customKey, 'customValue',
			`customKey 應被合併`);
	});

	test('當選項為 false 時不應加入配置', () =>
	{
		const argv = {
			preferOffline: false,
			shamefullyHoist: false,
		} as IYPXArguments;
		const result = handleOptionsToConfig(argv);

		assert.strictEqual(result.preferOffline, undefined,
			`preferOffline 不應加入`);
		assert.strictEqual(result.shamefullyHoist, undefined,
			`shamefullyHoist 不應加入`);
	});
});

describe('buildConfig', () =>
{
	test('應產生三種格式的配置 / Should generate three format configs', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		assert.ok('rc' in result,
			`應存在 rc 配置`);
		assert.ok('npmrc' in result,
			`應存在 npmrc 配置`);
		assert.ok('yml' in result,
			`應存在 yml 配置`);
	});

	test('產生的配置應包含換行符結尾', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		assert.ok(result.rc.endsWith('\n'),
			`rc 應以換行結尾`);
		assert.ok(result.npmrc.endsWith('\n'),
			`npmrc 應以換行結尾`);
		assert.ok(result.yml.endsWith('\n'),
			`yml 應以換行結尾`);
	});

	test('應合併預設配置與使用者配置', () =>
	{
		const argv = {} as IYPXArguments;
		const userconfig = {
			customConfig: 'value',
		};
		const result = buildConfig(argv, userconfig);

		assert.ok(result.rc.includes('customConfig'),
			`rc 應包含 customConfig`);
		assert.ok(result.rc.includes('enableGlobalCache'),
			`rc 應包含 enableGlobalCache`);
	});

	test('應正確處理 argv 選項', () =>
	{
		const argv = {
			preferOffline: true,
			shamefullyHoist: true,
		} as IYPXArguments;
		const result = buildConfig(argv);

		assert.ok(result.rc.includes('preferOffline'),
			`rc 應包含 preferOffline`);
		assert.ok(result.rc.includes('shamefullyHoist'),
			`rc 應包含 shamefullyHoist`);
		assert.ok(result.yml.includes('preferOffline'),
			`yml 應包含 preferOffline`);
		assert.ok(result.yml.includes('shamefullyHoist'),
			`yml 應包含 shamefullyHoist`);
	});

	test('rc 格式應使用空格分隔', () =>
	{
		const argv = {} as IYPXArguments;
		const result = buildConfig(argv);

		// 驗證 rc 格式使用空格分隔（非等號）
		const lines = result.rc.trim().split('\n');
		lines.forEach(line =>
		{
			assert.match(line, /^\S+\s+\S+$/,
				`rc 行應使用空格分隔: ${line}`);
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
			assert.match(line, /^\S+=\S+$/,
				`npmrc 行應使用等號分隔: ${line}`);
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
			assert.match(line, /^[a-zA-Z]+:\s+\S+$/,
				`yml 行應使用冒號加空格: ${line}`);
		});
	});

	test('應生成快照匹配結果', (t) =>
	{
		const argv = {
			preferOffline: true,
		} as IYPXArguments;
		const userconfig = {
			customSetting: 'test',
		};
		const result = buildConfig(argv, userconfig);

		t.assert.snapshot(result);
	});
});
