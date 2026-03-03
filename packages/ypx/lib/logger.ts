/**
 * 日誌記錄模組
 * Logger Module
 *
 * 負責建立 YPX 的日誌記錄器，支援彩色輸出和時間標記
 * Responsible for creating YPX logger, supports colored output and time labels
 *
 * @author bluelovers
 * @since 2020-01-29
 */

import { Console2 } from 'debug-color2'
import { IYPXArgumentsInput } from './types';

/**
 * 建立新的日誌記錄器
 * Create new logger
 *
 * 根據參數設定是否啟用日誌輸出，支援標籤和時間顯示
 * Creates logger with label and time display, enabled based on quiet parameter
 *
 * @param {IYPXArgumentsInput} argv - YPX 輸入參數 / YPX input arguments
 * @returns {Console2} 日誌記錄器實例 / Logger instance
 */
export function newLogger(argv: IYPXArgumentsInput)
{
	/**
	 * 建立 Console2 實例，啟用標籤和時間顯示
	 * Create Console2 instance with label and time display enabled
	 */
	let console = new Console2(null, {
		/** 啟用標籤顯示 / Enable label display */
		label: true,
		/** 啟用時間顯示 / Enable time display */
		time: true,
	});

	/**
	 * 根據 quiet 參數設定是否啟用日誌輸出
	 * Enable/disable logger based on quiet parameter
	 */
	console.enabled = !argv['quiet'];

	return console;
}

export default newLogger
