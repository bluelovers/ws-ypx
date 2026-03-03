/**
 * 命令查找模組
 * Command Finder Module
 *
 * 負責查找套件的二進制執行檔路徑，主要透過 yarn bin 指令實現
 * Responsible for finding package binary executable paths, primarily through yarn bin command
 *
 * @author bluelovers
 * @since 2020-01-30
 */
import { sync as crossSpawnExtra } from 'cross-spawn-extra';
import { pathExistsSync, readJSON } from 'fs-extra';
import binExists from 'bin-exists';
import { dirname } from 'path';

/**
 * 查找命令的二進制檔案路徑
 * Find command binary file path
 *
 * 使用 yarn bin 指令查找指定套件的二進制執行檔位置
 * Uses yarn bin command to find binary executable location for specified package
 *
 * @param {string} name - 套件名稱 / Package name
 * @param {string} cwd - 工作目錄 / Working directory
 * @returns {Promise<string>} 二進制檔案完整路徑 / Full path to binary file
 */
export async function findCommand(name: string, cwd: string)
{
	/**
	 * 執行 yarn bin 指令取得套件二進制路徑
	 * Execute yarn bin command to get package binary path
	 */
	let cp = await crossSpawnExtra('yarn', [
		'bin',
		name,
	].filter(v => v != null), {
		stripAnsi: true,
		cwd,
		env: process.env,
	});

	/**
	 * 清理輸出字串（移除前後空白）
	 * Clean output string (remove leading/trailing whitespace)
	 */
	let bin = cp.stdout.toString()
		.replace(/^\s+|\s+$/g, '')
	;

	/**
	 * 驗證路徑是否存在，若存在則返回
	 * Verify path exists and return if valid
	 */
	if (bin && pathExistsSync(bin))
	{
		return bin;
	}
}

/**
 * 查找命令（已棄用）
 * Find command (deprecated)
 *
 * @deprecated 請使用 findCommand 替代 / Please use findCommand instead
 *
 * 透過解析 package.json 的 bin 欄位來查找二進制檔案
 * Finds binary file by parsing package.json bin field
 *
 * @param {string} name - 套件名稱 / Package name
 * @param {string} cwd - 工作目錄 / Working directory
 */
async function findCommand2(name: string, cwd: string)
{
	try
	{
		/**
		 * 解析套件的 package.json 檔案路徑
		 * Resolve package.json file path
		 */
		let file = require.resolve(name + '/package.json', {
			paths: [cwd]
		});

		/**
		 * 讀取並解析 package.json
		 * Read and parse package.json
		 */
		let json = await readJSON(file);
		let dir = dirname(file);

		/**
		 * 檢查 bin 欄位是否存在
		 * Check if bin field exists
		 */
		if (json.bin)
		{
			/**
			 * 處理 bin 欄位（可能是字串或物件）
			 * Handle bin field (can be string or object)
			 */
			let bin: string;
			if (typeof json.bin === 'string')
			{
				bin = json.bin;
			}
			else
			{
				bin = Object.values(json.bin)[0] as string
			}


		}
	}
	catch (e)
	{
		/**
		 * 忽略解析錯誤
		 * Ignore parsing errors
		 */
	}
}

export default findCommand
