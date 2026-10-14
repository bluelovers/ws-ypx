/**
 * installDependencies 模組測試
 * installDependencies Module Tests
 *
 * 測試套件管理器檢測與安裝功能
 * Tests package manager detection and installation functionality
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
	getInstallArgs,


} from '../lib/installDependencies';
import {
	_handleClientsToCheck,
	EnumPackageManager,
	IPackageManager,
	whichPackageManager,
} from './lib/whichPackageManager';

const defaultClients = _handleClientsToCheck();

describe('installDependencies', () =>
{
	describe('whichPackageManager', () =>
	{
		it('應該返回預設套件管理器當沒有指定時', async () =>
		{
			const result = await whichPackageManager(undefined);
			assert.notStrictEqual(result, undefined,
				`應回傳套件管理器`);
			assert.ok(defaultClients.includes(result),
				`回傳的套件管理器應在預設清單中`);
		});

		it('應該依序檢查指定的套件管理器', async () =>
		{
			const result = await whichPackageManager(['yarn', 'npm']);
			assert.notStrictEqual(result, undefined,
				`應回傳套件管理器`);
		});
	});

	describe('_handleClientsToCheck', () =>
	{
		it('Should merge user-specified with default order', () =>
		{
			const result = _handleClientsToCheck(['yarn']);
			assert.ok(result.includes('yarn'),
				`應包含 yarn`);
			assert.ok(result.includes('npm'),
				`應包含 npm`);
			assert.ok(result.includes('pnpm'),
				`應包含 pnpm`);
		});

		it('應該返回預設順序當沒有指定時', () =>
		{
			const result = _handleClientsToCheck(undefined);
			assert.deepStrictEqual(result, ['pnpm', 'yarn', 'npm'],
				`應回傳預設順序`);
		});

		it('應該移除重複項目', () =>
		{
			const result = _handleClientsToCheck(['yarn', 'yarn', 'npm']);
			const uniqueResult = [...new Set(result)];
			assert.deepStrictEqual(result, uniqueResult,
				`不應包含重複項目`);
		});
	});

	describe('getInstallArgs', () =>
	{
		const baseConfig = {
			package: ['lodash', 'axios'],
			quiet: false,
			preferOffline: false,
			userconfig: undefined,
			shamefullyHoist: false,
		};

		it('應該為 yarn 產生正確的安裝參數', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, baseConfig);
			assert.ok(args.includes('add'),
				`yarn 應使用 add`);
			assert.ok(args.includes('lodash'),
				`應包含 lodash`);
			assert.ok(args.includes('axios'),
				`應包含 axios`);
			assert.ok(args.includes('--link-duplicates'),
				`yarn 應包含 --link-duplicates`);
			t.assert.snapshot(args);
		});

		it('應該為 npm 產生正確的安裝參數', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.npm, baseConfig);
			assert.ok(args.includes('install'),
				`npm 應使用 install`);
			assert.ok(args.includes('lodash'),
				`應包含 lodash`);
			assert.ok(args.includes('--no-save'),
				`npm 應包含 --no-save`);
			t.assert.snapshot(args);
		});

		it('應該為 pnpm 產生正確的安裝參數', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.pnpm, baseConfig);
			assert.ok(args.includes('add'),
				`pnpm 應使用 add`);
			assert.ok(args.includes('lodash'),
				`應包含 lodash`);
			assert.ok(args.includes('--ignore-scripts'),
				`pnpm 應包含 --ignore-scripts`);
			t.assert.snapshot(args);
		});

		it('應該在 quiet 模式下加入 --quiet', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, {
				...baseConfig,
				quiet: true,
			});
			assert.ok(args.includes('--quiet'),
				`quiet 模式應包含 --quiet`);
			t.assert.snapshot(args);
		});

		it('應該在 preferOffline 模式下加入對應選項', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, {
				...baseConfig,
				preferOffline: true,
			});
			assert.ok(args.includes('--prefer-offline'),
				`preferOffline 模式應包含 --prefer-offline`);
			t.assert.snapshot(args);
		});

		it('Should filter out null values', (t) =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, baseConfig);
			const list: readonly unknown[] = args;
			assert.ok(!list.includes(null),
				`不應包含 null`);
			assert.ok(!list.includes(undefined),
				`不應包含 undefined`);
			t.assert.snapshot(args);
		});
	});
});
