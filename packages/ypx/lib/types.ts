/**
 * 型別定義模組
 * Type Definitions Module
 *
 * 定義 YPX 工具的核心型別與介面
 * Defines core types and interfaces for YPX tool
 *
 * @author bluelovers
 * @since 2020-01-29
 */

import { ITSPickExtra } from 'ts-type';
import { Console2 } from 'debug-color2';
import { IYPXArguments } from '@ynpx/ynpx-argv';

/**
 * YPX 參數輸入型別
 * YPX Arguments Input Type
 *
 * 從 IYPXArguments 中選取必要欄位，package 為必填項
 * Picks required fields from IYPXArguments, with package as required
 */
export type IYPXArgumentsInput = ITSPickExtra<IYPXArguments, 'package', Exclude<keyof IYPXArguments, 'package'>>;

/**
 * 執行時快取介面
 * Runtime Cache Interface
 *
 * 用於存儲 YPX 執行過程中的臨時狀態與資料
 * Used to store temporary state and data during YPX execution
 */
export interface IRuntimeCache
{
	/** 臨時目錄路徑（唯讀）/ Temporary directory path (readonly) */
	readonly tmpDir: string,
	/** 目錄是否已建立 / Whether directory has been created */
	created: boolean,
	/** 環境變數（可選）/ Environment variables (optional) */
	env?: {
		/** 環境變數名稱與值 / Environment variable names and values */
		readonly [name: string]: string | undefined;
		/** PATH 環境變數（唯讀）/ PATH environment variable (readonly) */
		readonly Path: string;
	},
	/** 跳過安裝的套件對應表 / Map of packages to skip installation */
	skipInstall: Record<string, string>,
	/** 日誌記錄器實例（唯讀）/ Logger instance (readonly) */
	readonly console: Console2,

	needInitTmpPkg: boolean,
}
