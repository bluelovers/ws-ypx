/**
 * @ynpx/ynpx-argv 測試套件
 * Test suite for @ynpx/ynpx-argv
 *
 * 測試命令列參數解析的各種場景和邊界案例
 * Test various scenarios and edge cases for command line argument parsing
 */

import parseArgv, { IYPXArguments } from '../index';
import { Arguments } from 'yargs';
import { inspect } from 'util';

/**
 * 基本功能測試
 * Basic functionality tests
 */

test(`test - 基本參數解析 / Basic argument parsing`, () =>
{
	let inputArgv = [
		'-p',
		'ncu2',
		'-p',
		'ncu',
		'ncu',
		'-u',
	];

	let actual = _parseArgvMatchObject(inputArgv, {
		package: ['ncu2', 'ncu'],
		_: ['ncu'],
		'--': ['-u'],
	});

});

test(`test2`, () =>
{
	let inputArgv = [
		'-p',
		'ncu2',
		'-p',
		'ncu',
		'ncu',
		'--',
		'-u',
	];

	let actual = _parseArgvMatchObject(inputArgv, {
		package: ['ncu2', 'ncu'],
		_: ['ncu'],
		'--': ['-u'],
	});

});

describe(`test snap`, () => {

	([
		[
			'-q',
			'--ignore-existing',
			'cowsay@latest',
			'--',
			'test'
		],
		[
			'cowsay',
			'-q',
			'--ignore-existing',
			'--',
			'test'
		],
		[
			'-q',
			'--ignore-existing',
			'cowsay',
			'--',
			'test'
		],
		[
			'speedtest',
			'--',
			'-q',
		],
		[
			'speedtest',
			'-q',
		],
		[
			'-p',
			'xxx',
			'yyy',
			'-p',
		],
		'-p esm -p ts-node -p mocha -- -r esm'.split(' '),
		'-p yo -p generator-eslint-typescript yo -- eslint:plugin'.split(' '),
		'-p yo -p generator-eslint --debugMode yo eslint:rule'.split(' '),
		'create-next-app --example with-typescript-graphql with-typescript-graphql-app'.split(' '),
	] as string[][]).forEach(inputArgv => {

		test(inspect(inputArgv), () => {

			let actual = _parseArgvMatchObject(inputArgv);

		})

	})

})

/**
 * 選項功能測試
 * Option functionality tests
 */
describe(`選項測試 / Option tests`, () => {

	/**
	 * 測試靜默模式選項
	 * Test quiet mode option
	 */
	test(`quiet 選項 / quiet option`, () => {
		_parseArgvMatchObject(['-q', 'mocha'], {
			quiet: true,
			q: true,
		});
	});

	/**
	 * 測試優先離線選項
	 * Test prefer offline option
	 */
	test(`preferOffline 選項 / preferOffline option`, () => {
		_parseArgvMatchObject(['--prefer-offline', 'npm'], {
			preferOffline: true,
		});
	});

	/**
	 * 測試忽略已存在選項
	 * Test ignore existing option
	 */
	test(`ignoreExisting 選項 / ignoreExisting option`, () => {
		_parseArgvMatchObject(['--ignore-existing', 'jest'], {
			ignoreExisting: true,
			'ignore-existing': true,
		});
	});

	/**
	 * 測試不安裝選項
	 * Test no install option
	 *
	 * 注意：yargs 會將 --no-install 解析為 install=false
	 * 但不會自動生成 noInstall 屬性
	 * Note: yargs parses --no-install as install=false
	 * but does not auto-generate noInstall property
	 */
	test(`noInstall 選項 / noInstall option`, () => {
		_parseArgvMatchObject(['--no-install', 'eslint'], {
			install: false,
		});
	});

	/**
	 * 測試除錯模式選項
	 * Test debug mode option
	 */
	test(`debugMode 選項 / debugMode option`, () => {
		_parseArgvMatchObject(['--debug-mode', 'node'], {
			debugMode: true,
			'debug-mode': true,
		});
	});

	/**
	 * 測試使用者設定檔選項
	 * Test user config option
	 *
	 * 注意：路徑會被 yargs normalize 選項正規化
	 * Note: Path is normalized by yargs normalize option
	 */
	test(`userconfig 選項 / userconfig option`, () => {
		_parseArgvMatchObject(['--userconfig', '/path/to/.yarnrc', 'yarn'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});
	});

	/**
	 * 測試 userconfig 別名
	 * Test userconfig aliases
	 */
	test(`userconfig 別名 / userconfig aliases`, () => {
		_parseArgvMatchObject(['--useYarnrc', '/config/.yarnrc', 'node'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});

		_parseArgvMatchObject(['--rc', '/root/.yarnrc', 'npm'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});
	});

	/**
	 * 測試 npmClient 選項
	 * Test npmClient option
	 */
	test(`npmClient 選項 / npmClient option`, () => {
		const actual = _parseArgvMatchObject(['--pm', 'yarn', 'mocha'], {
			npmClient: ['yarn'],
		});
		expect(actual.npmClient).toHaveLength(1);
	});

	/**
	 * 測試多個 npmClient
	 * Test multiple npmClients
	 */
	test(`多個 npmClient / Multiple npmClients`, () => {
		const actual = _parseArgvMatchObject(['--pm', 'yarn', '--pm', 'pnpm', '--npmClient', 'npm', 'mocha'], {
			npmClient: ['yarn', 'pnpm', 'npm'],
		});
		expect(actual.npmClient).toHaveLength(3);
	});

	/**
	 * 測試 --npmClient 長選項
	 * Test --npmClient long option
	 */
	test(`--npmClient 長選項 / --npmClient long option`, () => {
		const actual = _parseArgvMatchObject(['--npmClient', 'pnpm', 'node'], {
			npmClient: ['pnpm'],
		});
		expect(actual.npmClient).toHaveLength(1);
	});

	/**
	 * 測試 verbose 選項會將 quiet 設為 false
	 * Test verbose option sets quiet to false
	 */
	test(`verbose 選項使 quiet 為 false / verbose option sets quiet to false`, () => {
		const actual = _parseArgvMatchObject(['--verbose', 'mocha'], {
			verbose: true,
			quiet: false,
		});
		expect(actual.verbose).toBe(true);
		expect(actual.quiet).toBe(false);
	});

	/**
	 * 測試僅啟用 verbose（未指定 quiet）
	 * Test verbose only (quiet not specified)
	 */
	test(`僅啟用 verbose / verbose only`, () => {
		const actual = _parseArgvMatchObject(['--verbose', 'jest'], {
			verbose: true,
			quiet: false,
		});
		expect(actual.verbose).toBe(true);
		expect(actual.quiet).toBe(false);
	});

});

/**
 * package 選項測試
 * Package option tests
 */
describe(`package 選項測試 / Package option tests`, () => {

	/**
	 * 測試單個 package 被轉換為陣列
	 * Test single package is converted to array
	 */
	test(`單個 package 轉陣列 / Single package to array`, () => {
		const actual = _parseArgvMatchObject(['-p', 'lodash', 'node'], {
			package: expect.arrayContaining(['lodash']),
		});
		expect(actual.package).toHaveLength(1);
	});

	/**
	 * 測試多個 package
	 * Test multiple packages
	 */
	test(`多個 package / Multiple packages`, () => {
		const actual = _parseArgvMatchObject(['-p', 'jest', '-p', 'mocha', '-p', 'vitest', 'test'], {
			package: expect.arrayContaining(['jest', 'mocha', 'vitest']),
		});
		expect(actual.package).toHaveLength(3);
	});

	/**
	 * 測試 --package 長選項
	 * Test --package long option
	 */
	test(`--package 長選項 / --package long option`, () => {
		const actual = _parseArgvMatchObject(['--package', 'typescript', 'tsc'], {
			package: expect.arrayContaining(['typescript']),
		});
		expect(actual.package).toHaveLength(1);
	});

});

/**
 * 邊界案例測試
 * Edge case tests
 */
describe(`邊界案例 / Edge cases`, () => {

	/**
	 * 測試無命令的情況
	 * Test no command scenario
	 */
	test(`無命令 / No command`, () => {
		const actual = _parseArgvMatchObject(['-p', 'lodash'], {
			_: expect.any(Array),
			package: expect.arrayContaining(['lodash']),
		});
		expect(actual._).toHaveLength(0);
	});

	/**
	 * 測試空參數陣列
	 * Test empty arguments array
	 *
	 * 注意：無輸入時 -- 屬性為 undefined
	 * Note: -- property is undefined when no input provided
	 */
	test(`空參數陣列 / Empty arguments array`, () => {
		const actual = parseArgv([]);
		expect(actual._).toEqual([]);
		// 無 -- 時屬性為 undefined / Property is undefined when no -- present
		expect(actual['--']).toBeUndefined();
	});

	/**
	 * 測試僅有命令
	 * Test command only
	 */
	test(`僅有命令 / Command only`, () => {
		const actual = _parseArgvMatchObject(['node'], {
			_: expect.arrayContaining(['node']),
			'--': expect.any(Array),
		});
		expect(actual._).toHaveLength(1);
	});

	/**
	 * 測試多個位置參數
	 * Test multiple positional arguments
	 *
	 * 注意：解析邏輯將命令後的參數移到 `--`
	 * Note: Parsing logic moves arguments after command to `--`
	 */
	test(`多個位置參數 / Multiple positional arguments`, () => {
		const actual = _parseArgvMatchObject(['node', 'script.js', 'arg1'], {
			// 第一個位置參數是命令 / First positional is the command
			_: expect.arrayContaining(['node']),
			// 後面的參數移到 `--` / Remaining args moved to `--`
			'--': expect.arrayContaining(['script.js', 'arg1']),
		});
		expect(actual._).toHaveLength(1);
		expect(actual['--']).toHaveLength(2);
	});

	/**
	 * 測試 -- 後無參數
	 * Test no arguments after --
	 */
	test(`-- 後無參數 / No args after --`, () => {
		const actual = _parseArgvMatchObject(['mocha', '--'], {
			_: expect.arrayContaining(['mocha']),
			'--': expect.any(Array),
		});
		expect(actual._).toHaveLength(1);
		expect(actual['--']).toHaveLength(0);
	});

	/**
	 * 測試選項值與命令同名
	 * Test option value same as command name
	 */
	test(`選項值與命令同名 / Option value same as command`, () => {
		const actual = _parseArgvMatchObject(['-p', 'mocha', 'mocha', '--', '-R', 'spec'], {
			package: expect.arrayContaining(['mocha']),
			_: expect.arrayContaining(['mocha']),
			'--': expect.arrayContaining(['-R', 'spec']),
		});
		expect(actual.package).toHaveLength(1);
		expect(actual._).toHaveLength(1);
		expect(actual['--']).toHaveLength(2);
	});

});

/**
 * 複雜場景測試
 * Complex scenario tests
 */
describe(`複雜場景 / Complex scenarios`, () => {

	/**
	 * 測試多個選項組合
	 * Test multiple options combination
	 */
	test(`多選項組合 / Multiple options combination`, () => {
		_parseArgvMatchObject([
			'-q',
			'--prefer-offline',
			'--ignore-existing',
			'-p', 'typescript',
			'-p', 'eslint',
			'tsc',
			'--',
			'--project', './tsconfig.json'
		], {
			quiet: true,
			preferOffline: true,
			ignoreExisting: true,
			package: expect.arrayContaining(['typescript', 'eslint']),
			_: expect.arrayContaining(['tsc']),
			'--': expect.arrayContaining(['--project', './tsconfig.json']),
		});
	});

	/**
	 * 測試帶版本的套件名稱
	 * Test package name with version
	 */
	test(`帶版本的套件 / Package with version`, () => {
		const actual = _parseArgvMatchObject(['-p', 'lodash@4.17.21', 'node'], {
			package: expect.arrayContaining(['lodash@4.17.21']),
		});
		expect(actual.package).toHaveLength(1);
	});

	/**
	 * 測試 scoped package
	 * Test scoped package
	 */
	test(`scoped package`, () => {
		const actual = _parseArgvMatchObject(['-p', '@types/node', 'tsc'], {
			package: expect.arrayContaining(['@types/node']),
		});
		expect(actual.package).toHaveLength(1);
	});

	/**
	 * 測試 scoped package 帶版本
	 * Test scoped package with version
	 */
	test(`scoped package 帶版本 / scoped package with version`, () => {
		const actual = _parseArgvMatchObject(['-p', '@types/node@18.0.0', 'tsc'], {
			package: expect.arrayContaining(['@types/node@18.0.0']),
		});
		expect(actual.package).toHaveLength(1);
	});

	test(`--package=yo --package=generator-webapp`, () => {
		const actual = _parseArgvMatchObject(['--package=yo', '--package=generator-webapp'], {
			package: ['yo', 'generator-webapp'],
		});
		expect(actual.package).toHaveLength(2);
	});

	test(`--package=yo --package generator-webapp`, () => {
		const actual = _parseArgvMatchObject(['--package=yo', '--package', 'generator-webapp'], {
			package: ['yo', 'generator-webapp'],
		});
		expect(actual.package).toHaveLength(2);
	});

});

/**
 * Snapshot 輔助函數
 * Snapshot helper function
 *
 * 使用 property matcher 忽略 $0 路徑差異
 * Use property matcher to ignore $0 path differences
 *
 * @deprecated
 */
function argvSnap(actual: Arguments, expectObject: Partial<IYPXArguments> = null)
{
	expect(actual).toMatchSnapshot({
		$0: expect.any(String),
		...expectObject,
	});
}

/**
 * parseArgv 結果驗證輔助函數
 * Helper function for verifying parseArgv results
 *
 * 統一處理 parseArgv 返回物件的 toMatchObject 驗證
 * Unified handling of toMatchObject verification for parseArgv return values
 *
 * @template T - 期望的屬性類型
 * @param {string[]} inputArgv - 輸入的命令列參數
 * @param {Partial<T>} expectObject - 期望匹配的屬性物件
 * @returns {T} parseArgv 的返回值
 */
function _parseArgvMatchObject<T extends IYPXArguments = IYPXArguments>(inputArgv: string[], expectObject: Partial<T> = null)
{
	const actual = parseArgv(inputArgv);
	// expectObject && expect(actual).toMatchObject(expectObject);
	expect({
		inputArgv,
		actual,
	}).toMatchSnapshot({
		actual: {
			$0: expect.any(String),
			...expectObject,
		},
	});

	return actual
}
