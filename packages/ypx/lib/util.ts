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
import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, SpawnOptions, SpawnSyncOptions, CrossSpawnExtra, stripAnsi } from 'cross-spawn-extra';
import { crlf } from 'crlf-normalize';

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
export function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options: {
	clearEol?: boolean,
	stripAnsi?: boolean,
} = {
	clearEol: true,
}): string
{
	/**
	 * 輸出字串累積器
	 * Output string accumulator
	 */
	let output = '';

	/**
	 * 檢查輸入是否為陣列（spawn 輸出陣列）
	 * Check if input is array (spawn output array)
	 */
	if (!Buffer.isBuffer(buf) && Array.isArray(buf))
	{
		/**
		 * 過濾掉空緩衝區並轉換為字串
		 * Filter out empty buffers and convert to strings
		 */
		output = buf
			.filter(function (b)
			{
				/**
				 * 過濾掉空值或空長度的緩衝區
				 * Filter out null or zero-length buffers
				 */
				return !(!b || !b.length)
			})
			.map(function (b)
			{
				/**
				 * 將緩衝區轉換為字串
				 * Convert buffer to string
				 */
				return b.toString();
			})
			.join("\n")
	}
	else
	{
		/**
		 * 直接轉換 Buffer 或預設值為字串
		 * Directly convert Buffer or default value to string
		 */
		output = (buf || '').toString();
	}

	/**
	 * 若啟用，移除 ANSI 轉義碼
	 * Remove ANSI escape codes if enabled
	 */
	if (options.stripAnsi)
	{
		output = stripAnsi(output);
	}

	/**
	 * 正規化換行符號為 CRLF
	 * Normalize line endings to CRLF
	 */
	output = crlf(output);

	/**
	 * 若啟用，移除結尾的多餘換行
	 * Remove trailing newlines if enabled
	 */
	if (options.clearEol || options.clearEol == null)
	{
		output = output.replace(/\n+$/g, '');
	}

	return output;
}
