/**
 * 環境變數處理模組
 * Environment Variable Processing Module
 *
 * 負責處理 YPX 執行時的環境變數設定，特別是 PATH 的修改
 * Responsible for handling environment variables during YPX execution, especially PATH modifications
 *
 * @author bluelovers
 * @since 2020-01-29
 */

import { envObject } from '@yarn-tool/env-path'
import { IRuntimeCache } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';

/**
 * 處理環境變數，將臨時目錄加入 PATH
 * Handle environment variables, add temporary directory to PATH
 *
 * 建立新的環境變數物件，將臨時目錄路徑附加到 PATH 環境變數中
 * Creates new environment variable object with temporary directory appended to PATH
 *
 * @param {IYPXArguments} argv - YPX 參數 / YPX arguments
 * @param {IRuntimeCache} runtime - 執行時快取 / Runtime cache
 * @param {any} [_env] - 可選的環境變數覆寫 / Optional environment variable override
 * @returns {IRuntimeCache["env"]} 處理後的環境變數 / Processed environment variables
 */
export function handleEnv(argv: IYPXArguments, runtime: IRuntimeCache, _env?): IRuntimeCache["env"]
{
	/**
	 * 建立環境路徑物件，將臨時目錄附加到 PATH
	 * Create environment path object and append temporary directory to PATH
	 */
	let paths = envObject(_env || runtime.env || process.env)
		.path.append([runtime.tmpDir])
	;

	/**
	 * 取得環境變數物件
	 * Get environment variable object
	 */
	let env = paths.get.env();

	/**
	 * 統一設定 path、Path、PATH 三種常見的 PATH 環境變數名稱
	 * Normalize path, Path, and PATH environment variable names
	 */
	// @ts-ignore
	env.path = env.Path = env.PATH = paths.path.get.string();

	// @ts-ignore
	env['NPM_CONFIG_UPDATE_NOTIFIER'] = false;

	// @ts-ignore
	env['NO_UPDATE_NOTIFIER'] = true;

	/**
	 * 返回處理後的環境變數（使用型別斷言）
	 * Return processed environment variables (with type assertion)
	 */
	return env as any
}

export default handleEnv
