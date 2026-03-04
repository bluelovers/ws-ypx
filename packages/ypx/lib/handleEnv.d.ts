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
export declare function handleEnv(argv: IYPXArguments, runtime: IRuntimeCache, _env?: any): IRuntimeCache["env"];
export default handleEnv;
