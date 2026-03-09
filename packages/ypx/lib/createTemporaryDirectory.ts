/**
 * 臨時目錄建立模組
 * Temporary Directory Creation Module
 *
 * 負責建立 YPX 執行時所需的臨時工作目錄，用於安裝套件與執行命令
 * Responsible for creating temporary working directories needed during YPX execution,
 * used for package installation and command execution
 *
 * @author bluelovers
 * @since 2020-01-28
 */
import { dir as tmpDir } from 'tmp';
import Bluebird from 'bluebird';
import { join, normalize } from 'upath2';
import { sync as crossSpawnExtra } from 'cross-spawn-extra';
import { pathExistsSync, remove } from 'fs-extra';

/**
 * 取得快取目錄路徑
 * Get cache directory path
 *
 * 優先從 Yarn 設定取得 tempFolder，若失敗則使用環境變數 YARN_CACHE_FOLDER
 * Prioritizes getting tempFolder from Yarn config, falls back to YARN_CACHE_FOLDER environment variable
 *
 * @returns {string} 快取目錄路徑 / Cache directory path
 */
export function _getCacheDir(): string
{
	try
	{
		/**
		 * 執行 yarn config current 取得目前設定
		 * Execute yarn config current to get current settings
		 */
		let cp = crossSpawnExtra('yarn', [
			'config',
			'current',
			'--json',
		], {
			stripAnsi: true,
			env: process.env,
		});

		/**
		 * 解析 Yarn 設定 JSON，取得 tempFolder 設定
		 * Parse Yarn config JSON to get tempFolder setting
		 */
		let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);

		if (data.tempFolder)
		{
			return data.tempFolder
		}
	}
	catch (e)
	{
		/**
		 * 忽略錯誤，繼續嘗試其他方式取得快取目錄
		 * Ignore error and continue trying other methods to get cache directory
		 */
	}

	/**
	 * 若環境變數存在且目錄存在，使用 YARN_CACHE_FOLDER
	 * Use YARN_CACHE_FOLDER if environment variable exists and directory exists
	 */
	if (process.env['YARN_CACHE_FOLDER'] && pathExistsSync(process.env['YARN_CACHE_FOLDER']))
	{
		return join(process.env['YARN_CACHE_FOLDER'], '_ypx')
	}
}

/**
 * 建立臨時目錄
 * Create temporary directory
 *
 * 使用 tmp 套件建立臨時目錄，目錄名稱前綴為 'ypx_'
 * Uses tmp package to create temporary directory with 'ypx_' prefix
 *
 * @returns {Bluebird<string>} 臨時目錄路徑 / Temporary directory path
 */
export function createTemporaryDirectory()
{
	return new Bluebird<string>((resolve, reject) =>
	{
		/**
		 * 取得快取目錄作為臨時檔案根目錄
		 * Get cache directory as temporary file root directory
		 */
		const tmpdir = _getCacheDir();

		/**
		 * 使用 tmp.dir 建立臨時目錄
		 * Use tmp.dir to create temporary directory
		 */
		tmpDir({
			unsafeCleanup: false,
			prefix: 'ypx_',
			dir: tmpdir,
			// @ts-ignore
			tmpdir,
		}, (error, dirPath) =>
		{
			if (error)
			{
				reject(error);
			}
			else
			{
				resolve(normalize(dirPath));
			}
		});
	})
}

/**
 * 建立新的臨時目錄物件
 * Create new temporary directory object
 *
 * 返回包含臨時目錄路徑和移除方法的物件，便於管理臨時檔案
 * Returns object with temporary directory path and remove method for easy temp file management
 *
 * @returns {Promise<{tmpDir: string, remove: () => Promise<void>}>} 臨時目錄物件 / Temporary directory object
 */
export async function newTemporary()
{
	/**
	 * 建立臨時目錄
	 * Create temporary directory
	 */
	let tmpDir = await createTemporaryDirectory();

	/**
	 * 返回包含臨時目錄路徑和移除方法的物件
	 * Return object containing temp directory path and remove method
	 */
	return {
		/**
		 * 取得臨時目錄路徑（getter）
		 * Get temporary directory path (getter)
		 */
		get tmpDir()
		{
			return tmpDir;
		},
		/**
		 * 移除臨時目錄
		 * Remove temporary directory
		 *
		 * @returns {Promise<void>}
		 */
		remove()
		{
			return remove(tmpDir);
		}
	}
}

export default createTemporaryDirectory
