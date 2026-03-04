/**
 * 選項處理模組
 * Options Processing Module
 *
 * 負責處理和正規化 YPX 的命令列參數，設定預設值並解析路徑
 * Responsible for processing and normalizing YPX command line arguments, setting defaults and resolving paths
 *
 * @author bluelovers
 * @since 2020-01-29
 */
import { IYPXArgumentsInput } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';
/**
 * 處理 YPX 參數選項
 * Handle YPX argument options
 *
 * 使用 deep clone 和 defaults 為參數設定預設值，並解析使用者設定檔路徑
 * Uses deep clone and defaults to set default values for arguments, and resolves user config file path
 *
 * @param {IYPXArgumentsInput} argv - 輸入的 YPX 參數 / Input YPX arguments
 * @returns {Required<IYPXArguments>} 處理後的完整參數 / Processed complete arguments
 */
export declare function handleOptions(argv: IYPXArgumentsInput): Required<IYPXArguments>;
export default handleOptions;
