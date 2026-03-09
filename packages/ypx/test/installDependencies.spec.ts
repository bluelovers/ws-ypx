/**
 * installDependencies 模組測試
 * installDependencies Module Tests
 *
 * 測試套件管理器檢測與安裝功能
 * Tests package manager detection and installation functionality
 */

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
		it('應該返回預設套件管理器當沒有指定時 / Should return default package manager when none specified', async () =>
		{
			const result = await whichPackageManager(undefined);
			expect(result).toBeDefined();
			expect(defaultClients).toContain(result);
		});

		it('應該依序檢查指定的套件管理器 / Should check specified package managers in order', async () =>
		{
			const result = await whichPackageManager(['yarn', 'npm']);
			expect(result).toBeDefined();
		});
	});

	describe('_handleClientsToCheck', () =>
	{
		it('應該合併使用者指定與預設順序 / Should merge user-specified with default order', () =>
		{
			const result = _handleClientsToCheck(['yarn']);
			expect(result).toContain('yarn');
			expect(result).toContain('npm');
			expect(result).toContain('pnpm');
		});

		it('應該返回預設順序當沒有指定時 / Should return default order when none specified', () =>
		{
			const result = _handleClientsToCheck(undefined);
			expect(result).toEqual(['pnpm', 'yarn', 'npm']);
		});

		it('應該移除重複項目 / Should remove duplicates', () =>
		{
			const result = _handleClientsToCheck(['yarn', 'yarn', 'npm']);
			const uniqueResult = [...new Set(result)];
			expect(result).toEqual(uniqueResult);
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

		it('應該為 yarn 產生正確的安裝參數 / Should generate correct install args for yarn', () =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, baseConfig);
			expect(args).toContain('add');
			expect(args).toContain('lodash');
			expect(args).toContain('axios');
			expect(args).toContain('--link-duplicates');
			expect(args).toMatchSnapshot();
		});

		it('應該為 npm 產生正確的安裝參數 / Should generate correct install args for npm', () =>
		{
			const args = getInstallArgs(EnumPackageManager.npm, baseConfig);
			expect(args).toContain('install');
			expect(args).toContain('lodash');
			expect(args).toContain('--no-save');
			expect(args).toMatchSnapshot();
		});

		it('應該為 pnpm 產生正確的安裝參數 / Should generate correct install args for pnpm', () =>
		{
			const args = getInstallArgs(EnumPackageManager.pnpm, baseConfig);
			expect(args).toContain('add');
			expect(args).toContain('lodash');
			expect(args).toContain('--ignore-scripts');
			expect(args).toMatchSnapshot();
		});

		it('應該在 quiet 模式下加入 --quiet / Should add --quiet in quiet mode', () =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, {
				...baseConfig,
				quiet: true,
			});
			expect(args).toContain('--quiet');
			expect(args).toMatchSnapshot();
		});

		it('應該在 preferOffline 模式下加入對應選項 / Should add prefer-offline option', () =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, {
				...baseConfig,
				preferOffline: true,
			});
			expect(args).toContain('--prefer-offline');
			expect(args).toMatchSnapshot();
		});

		it('應該過濾掉空值參數 / Should filter out null values', () =>
		{
			const args = getInstallArgs(EnumPackageManager.yarn, baseConfig);
			expect(args).not.toContain(null);
			expect(args).not.toContain(undefined);
			expect(args).toMatchSnapshot();
		});
	});
});
