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

/** @type {import('@bluelovers/jest-config')} */
const { mixinJestConfig } = _lazyRequire('@bluelovers/jest-config');

/**
 * @_type { import('@jest/types').Config.InitialOptions }
 * @_type { import('ts-jest').InitialOptionsTsJest }
 * @type { import('ts-jest').JestConfigWithTsJest }
 */
const jestConfig = mixinJestConfig({}, true, {
	file: __filename,
});

module.exports = jestConfig;
