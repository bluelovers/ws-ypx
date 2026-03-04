/**
 * 工具函數模組
 * Utility Functions Module
 *
 * 提供 YPX 執行過程中的各種輔助工具函數
 * Provides various helper utility functions for YPX execution
 *
 * @author bluelovers
 * @since 2020-01-30
 */
import { SpawnSyncReturns } from 'cross-spawn-extra';
/**
 * 處理 cross-spawn 輸出緩衝區
 * Process cross-spawn output buffer
 *
 * 將 spawn 輸出轉換為字串，支援陣列或 Buffer 輸入，可選移除 ANSI 碼和清理換行
 * Converts spawn output to string, supports array or Buffer input, optionally removes ANSI codes and cleans newlines
 *
 * @param {SpawnSyncReturns["output"] | Buffer} buf - 輸出緩衝區 / Output buffer
 * @param {Object} [options] - 處理選項 / Processing options
 * @param {boolean} [options.clearEol=true] - 是否清理結尾換行 / Whether to clear trailing newlines
 * @param {boolean} [options.stripAnsi] - 是否移除 ANSI 碼 / Whether to strip ANSI codes
 * @returns {string} 處理後的字串 / Processed string
 */
export declare function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options?: {
    clearEol?: boolean;
    stripAnsi?: boolean;
}): string;
