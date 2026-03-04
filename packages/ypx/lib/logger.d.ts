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
import { Console2 } from 'debug-color2';
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
export declare function newLogger(argv: IYPXArgumentsInput): Console2;
export default newLogger;
