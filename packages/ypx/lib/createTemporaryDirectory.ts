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
import { pathExistsSync, remove, ensureDirSync } from 'fs-extra';
import { getCachePath } from 'cache-path';

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
	return getCachePath({
		useGlobalDefaultFailback: true,
		create: true,
	})
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

		tmpdir?.length && ensureDirSync(tmpdir);

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
