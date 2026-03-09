/**
 * Npm Client 測試模組
 * Npm Client Test Module
 *
 * 測試使用不同 npm client（npm, yarn, pnpm）執行 ypx 的功能
 * Tests ypx execution with different npm clients (npm, yarn, pnpm)
 *
 * @author bluelovers
 * @since 2026-03-04
 */

import {
	_testCowsayWithClient,
	_verifyCowsayOutput,
	_getExpectedCowsayOutput,
} from './lib/helpers/cowsay-test-helper';
import { say } from 'cowsay';
import { _handleClientsToCheck, IPackageManager } from './lib/whichPackageManager';

/**
 * 設定測試超時時間為 60 分鐘
 * Set test timeout to 60 minutes
 *
 * 由於需要安裝套件，設置較長的超時時間
 * Longer timeout needed for package installation
 */
jest.setTimeout(60 * 60 * 1000);

/**
 * 測試的 npm client 列表
 * List of npm clients to test
 */
const NPM_CLIENTS: IPackageManager[] = _handleClientsToCheck();

/**
 * Cowsay 測試套件
 * Cowsay test suite
 */
describe('cowsay with different npm clients', () => {

	/**
	 * 測試不使用指定 npm client（使用預設值）
	 * Test without specifying npm client (use default)
	 */
	it('should work with default npm client', async () => {
		const result = await _testCowsayWithClient(undefined, 'default client');

		/**
		 * 驗證輸出包含 cowsay 格式
		 * Verify output contains cowsay format
		 */
		expect(_verifyCowsayOutput(result.output, 'default client')).toBe(true);

		/**
		 * 驗證輸出與預期的 cowsay 輸出匹配
		 * Verify output matches expected cowsay output
		 */
		expect(result.output).toContain(say({
			text: 'default client',
		}));
	});

	/**
	 * 為每個 npm client 建立測試案例
	 * Create test cases for each npm client
	 */
	describe.each(NPM_CLIENTS)('with %s', (npmClient) => {

		/**
		 * 測試基本 cowsay 功能
		 * Test basic cowsay functionality
		 */
		it(`should run cowsay using ${npmClient}`, async () => {
			const testText = `hello from ${npmClient}`;
			const result = await _testCowsayWithClient(npmClient, testText);

			/**
			 * 驗證輸出包含預期文字
			 * Verify output contains expected text
			 */
			expect(result.output).toContain(`< ${testText} >`);

			/**
			 * 驗證輸出包含 cowsay 牛圖案
			 * Verify output contains cowsay cow pattern
			 */
			expect(result.output).toContain('(oo)\\_______');

			/**
			 * 使用 snapshot 驗證完整輸出
			 * Use snapshot to verify complete output
			 */
			expect(result.output).toMatchSnapshot(_getExpectedCowsayOutput(testText));
		});

		/**
		 * 測試帶有特殊字元的文字
		 * Test text with special characters
		 */
		it(`should handle special characters with ${npmClient}`, async () => {
			const testText = 'test 123 !@#$%';
			const result = await _testCowsayWithClient(npmClient, testText);

			/**
			 * 驗證 cowsay 輸出格式正確
			 * Verify cowsay output format is correct
			 */
			expect(_verifyCowsayOutput(result.output, testText)).toBe(true);
		});

		/**
		 * 測試命令成功執行（結束代碼為 0）
		 * Test command executes successfully (exit code 0)
		 */
		it(`should exit with code 0 using ${npmClient}`, async () => {
			const result = await _testCowsayWithClient(npmClient, 'success test');

			/**
			 * 驗證結束代碼為 0 或 undefined（成功）
			 * Verify exit code is 0 or undefined (success)
			 */
			expect(result.exitCode).toBeFalsy();
		});

	});

});
