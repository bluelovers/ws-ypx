// @ts-check

/**
 * Jest 自動配置模組
 * Jest Auto Configuration Module
 *
 * 此模組自動偵測並配置 Jest 測試環境，支援多層級配置解析
 * This module automatically detects and configures Jest test environment with multi-level configuration resolution
 */

const { basename, extname, dirname } = require('path');

/**
 * Jest 配置物件
 * Jest configuration object
 *
 * @type { import('ts-jest').JestConfigWithTsJest }
 */
let jestConfig = {

}

/**
 * 嘗試使用 `@yarn-tool/require-resolve` 載入模組的工具函數
 * Utility function for lazy loading modules
 *
 * @param {string} name - 模組名稱 Module name
 * @param {string[]} [paths] - 搜尋路徑 Search paths
 * @private
 */
function _lazyRequire(name, paths)
{
	let m;
	try
	{
		// 嘗試使用 require-resolve 工具載入模組
		// Try to load module using require-resolve tool
		m = require('@yarn-tool/require-resolve').requireExtra(name, {
			includeCurrentDirectory: true,
			includeGlobal: true,
			paths,
		});
	}
	catch (e) {}

	// 如果失敗則使用標準 require
	// If failed, use standard require
	return typeof m === 'undefined' ? require(name) : m;
}

/**
 * 嘗試使用 `@yarn-tool/require-resolve` 解析模組路徑的工具函數
 * Utility function for resolving module paths
 *
 * @param {string} name - 模組名稱 Module name
 * @returns {string} - 解析後的路徑 Resolved path
 * @private
 */
function _requireResolve(name)
{
	let result;

	try
	{
		/** @type {import('@yarn-tool/require-resolve')} */
		const { requireResolveExtra, requireResolveCore } = _lazyRequire('@yarn-tool/require-resolve');

		// 嘗試從多個路徑解析 TSDX 相關模組
		// Try to resolve TSDX related modules from multiple paths
		const paths = [
			requireResolveExtra('@bluelovers/tsdx').result,
			requireResolveExtra('tsdx').result,
		].filter(Boolean);

		result = requireResolveCore(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths,
		})
	}
	catch (e)
	{

	}

	// 如果都失敗，使用標準 resolve
	// If all failed, use standard resolve
	result = result || require.resolve(name);

	console.info('[require.resolve]', name, '=>', result)

	return result
}

// 配置解析狀態標誌
// Configuration resolution status flag
let _isNeedConfig = true;

try
{
	// 第一層：搜尋工作區中的配置檔案
	// First level: Search for configuration files in workspace
	if (!jestConfig.preset)
	{
		/** @type {import('@yarn-tool/ws-find-up-paths')} */
		const { findUpPathsWorkspaces } = _lazyRequire('@yarn-tool/ws-find-up-paths');

		// 向上搜尋 jest-preset.js 和 jest.config.js
		// Search upwards for jest-preset.js and jest.config.js
		let result = findUpPathsWorkspaces([
			'jest-preset.js',
			'jest.config.js',
		], {
			ignoreCurrentPackage: true,  // 忽略當前套件
			onlyFiles: true,             // 只搜尋檔案
		}).result;

		if (result)
		{
			let name = basename(result, extname(result))

			switch (name)
			{
				case 'jest-preset':
					// 如果是 jest-preset.js，使用其目錄作為 preset
					// If it's jest-preset.js, use its directory as preset
					// @ts-ignore
					jestConfig.preset = dirname(result);
					break;
				default:
					// 其他情況，載入配置檔案內容
					// Otherwise, load the configuration file content
					jestConfig = {
						...require(result),
						jestConfig,
					};
					break;
			}

			_isNeedConfig = false;
		}
	}
}
catch (e)
{

}

try
{
	// 第二層：嘗試解析 @bluelovers/jest-config
	// Second level: Try to resolve @bluelovers/jest-config
	if (_isNeedConfig && !jestConfig.preset)
	{
		let result = _requireResolve('@bluelovers/jest-config/package.json');
		if (result)
		{
			// @ts-ignore
			jestConfig.preset = dirname(result);
			_isNeedConfig = false;
		}
	}
}
catch (e)
{

}

if (_isNeedConfig && !jestConfig.preset)
{
	// 第三層：使用預設的 @bluelovers/jest-config
	// Third level: Use default @bluelovers/jest-config
	// @ts-ignore
	jestConfig.preset = '@bluelovers/jest-config';
	_isNeedConfig = false;
}

// 輸出最終的 preset 設定
// Output the final preset configuration
console.info(`jest.config.preset: ${jestConfig.preset}`);

module.exports = jestConfig
