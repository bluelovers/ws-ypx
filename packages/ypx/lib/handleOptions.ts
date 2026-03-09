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
import { ITSPickExtra, ITSRequiredPick } from 'ts-type';
import { cloneDeep, defaultsDeep } from 'lodash';
import { resolve, normalize } from 'upath2';
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
export function handleOptions(argv: IYPXArgumentsInput): Required<IYPXArguments>
{
	/**
	 * 使用 defaultsDeep 為參數設定預設值
	 * Use defaultsDeep to set default values for arguments
	 */
	let result = defaultsDeep(cloneDeep(argv), {
		/** 套件列表預設為空陣列 / Package list defaults to empty array */
		package: [],
		/** 位置參數預設為空陣列 / Positional arguments default to empty array */
		_: [],
		/** -- 後的參數預設為空陣列 / Arguments after -- default to empty array */
		"--": [],
		/** 靜默模式 / Quiet mode */
		quiet: true,
		/** 離線優先預設關閉 / Prefer offline defaults to off */
		preferOffline: false,
		/** 忽略已存在預設關閉 / Ignore existing defaults to off */
		ignoreExisting: false,
		/** 不安裝預設關閉 / No install defaults to off */
		noInstall: false,
		/** 工作目錄預設為目前目錄 / Working directory defaults to current directory */
		cwd: normalize(argv['cwd'] ? argv['cwd'] as any : process.cwd()),
	}) as Required<IYPXArguments>;

	/**
	 * 若提供使用者設定檔路徑，解析為絕對路徑
	 * If user config file path provided, resolve to absolute path
	 */
	if (result.userconfig)
	{
		result.userconfig = resolve(result.cwd, result.userconfig);
	}

	return result;
}

export default handleOptions
