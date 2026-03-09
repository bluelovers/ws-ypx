/**
 * Cowsay 測試輔助函數模組
 * Cowsay Test Helper Module
 *
 * 提供測試不同 npm client 執行 cowsay 的共用邏輯
 * Provides shared logic for testing cowsay execution with different npm clients
 *
 * @author bluelovers
 * @since 2026-03-04
 */

import { runLocalBin } from '../../util';
import { newTemporary } from '../../../lib/createTemporaryDirectory';
import { crossSpawnOutput } from '../../../lib/util';
import { initTemporaryPackage } from '../../../lib/initTemporaryPackage';
import { say } from 'cowsay';

import { IPackageManager } from '../whichPackageManager';

/**
 * Cowsay 測試結果介面
 * Cowsay Test Result Interface
 */
export interface ICowsayTestResult
{
	cmdline: string;
	argv: string[];
	/** 命令輸出內容 / Command output content */
	output: string;
	/** 結束代碼（若有的話）/ Exit code (if available) */
	exitCode?: number;
	cowsay?: string;
}

/**
 * 建立臨時測試環境
 * Create Temporary Test Environment
 *
 * 建立臨時目錄並初始化 package.json
 * Creates temporary directory and initializes package.json
 *
 * @returns {Promise<{tmpDir: string, remove: () => Promise<void>}>} 臨時環境物件 / Temporary environment object
 */
export async function _createTestEnvironment()
{
	const actual = await newTemporary();
	await initTemporaryPackage(actual.tmpDir, {} as any);
	return actual;
}

/**
 * 使用 ypx 執行 cowsay
 * Run cowsay using ypx
 *
 * 透過 runLocalBin 呼叫 ypx 執行 cowsay 命令
 * Calls ypx via runLocalBin to execute cowsay command
 *
 * @param {string} text - cowsay 要顯示的文字 / Text for cowsay to display
 * @param {string} cwd - 工作目錄 / Working directory
 * @param {INpmClient} [npmClient] - 指定的 npm client / Specified npm client
 * @returns {Promise<ICowsayTestResult>} 執行結果 / Execution result
 */
export async function _runCowsayWithYpx(
	text: string,
	cwd: string,
	npmClient?: IPackageManager,
	cowsay?: `cowsay${string}`,
): Promise<ICowsayTestResult>
{
	/**
	 * 建構 ypx 參數陣列
	 * Build ypx arguments array
	 */
	const argv: string[] = [
		'-q',
		'--ignore-existing',
	];

	/**
	 * 若指定了 npm client，加入對應參數
	 * If npm client is specified, add corresponding parameter
	 */
	if (npmClient)
	{
		argv.push('--npmclient', npmClient);
	}

	/**
	 * 加入 cowsay 套件和文字參數
	 * Add cowsay package and text parameter
	 */
	argv.push(cowsay ??= 'cowsay', '--', text);

	/**
	 * 執行 ypx 命令
	 * Execute ypx command
	 */
	const cp = await runLocalBin(argv, {
		cwd,
		stripAnsi: true,
		env: process.env,
	});

	/**
	 * 處理輸出並返回結果
	 * Process output and return result
	 */
	const output = crossSpawnOutput(cp.output);

	return {
		cowsay,
		cmdline: argv.join(' '),
		argv,
		output,
		// @ts-ignore
		exitCode: cp.exitCode,
	};
}

/**
 * 驗證 cowsay 輸出
 * Verify cowsay output
 *
 * 檢查輸出是否包含預期的 cowsay 格式
 * Checks if output contains expected cowsay format
 *
 * @param {string} output - 命令輸出 / Command output
 * @param {string} text - 預期的文字 / Expected text
 * @returns {boolean} 是否通過驗證 / Whether verification passed
 */
export function _verifyCowsayOutput(output: string, text: string): boolean
{
	/**
	 * 檢查輸出是否包含預期文字
	 * Check if output contains expected text
	 */
	const hasText = output.includes(`< ${text} >`);

	/**
	 * 檢查輸出是否包含 cowsay 的牛圖案
	 * Check if output contains cowsay cow pattern
	 */
	const hasCow = output.includes('(oo)\\_______');

	return hasText && hasCow;
}

/**
 * 取得預期的 cowsay 輸出
 * Get expected cowsay output
 *
 * 使用 cowsay 套件產生預期的輸出內容
 * Uses cowsay package to generate expected output content
 *
 * @param {string} text - 輸入文字 / Input text
 * @returns {string} 預期的 cowsay 輸出 / Expected cowsay output
 */
export function _getExpectedCowsayOutput(text: string): string
{
	return say({ text });
}

/**
 * 測試 cowsay 的完整流程
 * Complete cowsay test flow
 *
 * 建立臨時環境、執行 cowsay、驗證輸出、清理環境
	 * Creates temp environment, runs cowsay, verifies output, cleans up environment
 *
 * @param {INpmClient} [npmClient] - 要測試的 npm client / Npm client to test
 * @param {string} [text] - cowsay 文字（預設為 'test'）/ Cowsay text (default is 'test')
 * @returns {Promise<ICowsayTestResult>} 測試結果 / Test result
 */
export async function _testCowsayWithClient(
	npmClient?: IPackageManager,
	text: string = 'test'
): Promise<ICowsayTestResult>
{
	/**
	 * 建立臨時測試環境
	 * Create temporary test environment
	 */
	const env = await _createTestEnvironment();

	let result: ICowsayTestResult;

	try
	{
		console.log(`[${npmClient ?? 'default'}] target =>`, env.tmpDir);

		/**
		 * 執行 cowsay
		 * Execute cowsay
		 */
		result = await _runCowsayWithYpx(text, env.tmpDir, npmClient);

		console.log(result.output);

		expect(result).toMatchSnapshot();
	}
	finally
	{
		/**
		 * 清理臨時環境
		 * Clean up temporary environment
		 */
		await env.remove();
	}

	return result;
}
