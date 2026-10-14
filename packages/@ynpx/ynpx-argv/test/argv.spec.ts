/**
 * @ynpx/ynpx-argv 測試套件
 * Test suite for @ynpx/ynpx-argv
 *
 * 測試命令列參數解析的各種場景和邊界案例
 * Test various scenarios and edge cases for command line argument parsing
 */

/// <reference types="node" />

import { describe, test } from 'node:test';
import type { TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { inspect, isDeepStrictEqual } from 'node:util';

import parseArgv, { IYPXArguments } from '../index';

/**
 * 非對稱比對器的辨識標記
 * Marker used to recognize asymmetric matchers
 */
const kMatcher = Symbol.for('asymmetricMatcher');

/**
 * 非對稱比對器介面（對應 Jest expect.* 的回傳值）
 * Asymmetric matcher interface (counterpart of Jest's expect.* return values)
 */
interface IMatcher
{
	readonly [kMatcher]: true;
	/** 用於錯誤訊息的描述 / Description used in error messages */
	readonly description: string;
	/** 檢查單一值是否符合 / Check whether a single value matches */
	test(value: unknown): boolean;
}

/**
 * expect.any() 支援的建構子
 * Constructors supported by expect.any()
 */
type TAnyConstructor = ArrayConstructor | StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor;

/**
 * 建立非對稱比對器
 * Create an asymmetric matcher
 *
 * @param {string} description - 用於錯誤訊息的描述 / Description used in error messages
 * @param {(value: unknown) => boolean} test - 檢查單一值的函式 / Predicate for a single value
 * @returns {IMatcher} 非對稱比對器 / The asymmetric matcher
 */
function createMatcher(description: string, test: (value: unknown) => boolean): IMatcher
{
	return { [kMatcher]: true, description, test };
}

/**
 * 判斷值是否為非對稱比對器
 * Check whether a value is an asymmetric matcher
 *
 * @param {unknown} value - 待檢查的值 / The value to check
 * @returns {value is IMatcher} 是否為比對器 / Whether the value is a matcher
 */
function isMatcher(value: unknown): value is IMatcher
{
	return typeof value === 'object' && value !== null && kMatcher in value;
}

/**
 * Jest expect.* 的最小替代品
 * Minimal replacement for Jest's expect.*
 *
 * Node.js 原生測試不提供 matcher，故只實作本套件實際用到的三個；
 * 用途是還原原本 snapshot 的 property matcher 行為（例如忽略 $0 路徑差異）
 * The native test runner ships no matchers, so only the three actually used here
 * are implemented; they restore the property-matcher behaviour of the previous
 * snapshots (for example ignoring $0 path differences)
 */
const expect = {
	/**
	 * expect.any(Constructor)：檢查值的型別
	 * expect.any(Constructor): check the type of a value
	 */
	any(constructor: TAnyConstructor): IMatcher
	{
		return createMatcher(`any(${constructor.name})`, (value) =>
		{
			if (constructor === Array) return Array.isArray(value);
			if (constructor === String) return typeof value === 'string';
			if (constructor === Number) return typeof value === 'number';
			if (constructor === Boolean) return typeof value === 'boolean';

			/* Object：非 null 的物件 / Object: a non-null object */
			return typeof value === 'object' && value !== null;
		});
	},

	/**
	 * expect.stringContaining(substring)：檢查字串包含指定子字串
	 * expect.stringContaining(substring): check that a string contains the given substring
	 */
	stringContaining(substring: string): IMatcher
	{
		return createMatcher(`stringContaining(${inspect(substring)})`, (value) =>
			typeof value === 'string' && value.includes(substring));
	},

	/**
	 * expect.arrayContaining(items)：檢查陣列包含所有期望元素（順序不拘）
	 * expect.arrayContaining(items): check that an array contains every expected item (order-independent)
	 */
	arrayContaining(items: readonly unknown[]): IMatcher
	{
		return createMatcher(`arrayContaining(${inspect(items)})`, (value) =>
		{
			if (!Array.isArray(value))
			{
				return false;
			}

			return items.every(item => value.some(element => findMismatch(element, item, '') === null));
		});
	},
};

/**
 * 以遞迴方式比對實際值與期望值
 * Recursively compare an actual value against an expected value
 *
 * 比對語意對齊 Jest 的 toMatchObject：
 * - 物件採部分比對：僅比對期望物件上列出的鍵，多餘的鍵一律忽略
 * - 陣列要求長度相同，並逐項比對
 * - 期望值本身可以是非對稱比對器（matcher）
 * Semantics align with Jest's toMatchObject:
 * - objects match partially: only keys listed in the expectation are compared, extra keys are ignored
 * - arrays require the same length and match element-wise
 * - the expected value itself may be an asymmetric matcher
 *
 * @param {unknown} actual - 實際的解析結果 / Actual parsed value
 * @param {unknown} expected - 期望值 / Expected value
 * @param {string} path - 目前的比對路徑，用於錯誤訊息 / Current match path, used in error messages
 * @returns {string | null} 不符時回傳錯誤訊息，相符時回傳 null / Error message on mismatch, null when matched
 */
function findMismatch(actual: unknown, expected: unknown, path: string): string | null
{
	if (isMatcher(expected))
	{
		return expected.test(actual)
			? null
			: `${path}: 預期符合 ${expected.description}，實際為 ${inspect(actual)} / expected to satisfy ${expected.description}, got ${inspect(actual)}`;
	}

	if (Array.isArray(expected))
	{
		if (!Array.isArray(actual))
		{
			return `${path}: 預期為陣列 ${inspect(expected)}，實際為 ${inspect(actual)} / expected array ${inspect(expected)}, got ${inspect(actual)}`;
		}

		if (actual.length !== expected.length)
		{
			return `${path}: 陣列長度預期為 ${expected.length}，實際為 ${actual.length}（${inspect(actual)}） / array length expected ${expected.length}, got ${actual.length} (${inspect(actual)})`;
		}

		for (let i = 0; i < expected.length; i++)
		{
			const mismatch = findMismatch(actual[i], expected[i], `${path}[${i}]`);
			if (mismatch !== null)
			{
				return mismatch;
			}
		}

		return null;
	}

	if (expected !== null && typeof expected === 'object')
	{
		if (actual === null || typeof actual !== 'object')
		{
			return `${path}: 預期為物件 ${inspect(expected)}，實際為 ${inspect(actual)} / expected object ${inspect(expected)}, got ${inspect(actual)}`;
		}

		for (const key of Object.keys(expected))
		{
			if (!(key in actual))
			{
				return `${path}.${key}: 預期存在此鍵但實際缺少（${inspect(actual)}） / expected key missing in ${inspect(actual)}`;
			}

			const mismatch = findMismatch(
				(actual as Record<string, unknown>)[key],
				(expected as Record<string, unknown>)[key],
				`${path}.${key}`,
			);
			if (mismatch !== null)
			{
				return mismatch;
			}
		}

		return null;
	}

	return isDeepStrictEqual(actual, expected)
		? null
		: `${path}: 預期為 ${inspect(expected)}，實際為 ${inspect(actual)} / expected ${inspect(expected)}, got ${inspect(actual)}`;
}

/**
 * 斷言類陣列值的長度
 * Assert the length of an array-like value
 *
 * @param {unknown} actual - 實際值，需帶有 length 屬性 / Actual value, must carry a length property
 * @param {number} expected - 期望的長度 / Expected length
 * @param {string} label - 用於錯誤訊息的標籤 / Label used in error messages
 * @returns {void}
 */
function assertLength(actual: unknown, expected: number, label: string): void
{
	if (actual === null || actual === undefined || typeof (actual as { length?: unknown }).length !== 'number')
	{
		assert.fail(`${label}: 預期為帶有 length 的類陣列值，實際為 ${inspect(actual)} / expected an array-like value with a length, got ${inspect(actual)}`);
	}

	assert.strictEqual(
		(actual as { length: number }).length,
		expected,
		`${label} 的長度不符 / unexpected length for ${label}`,
	);
}

/**
 * parseArgv 結果驗證輔助函數
 * Helper function for verifying parseArgv results
 *
 * 驗證分兩層，行為對齊原本的 Jest 寫法：
 * 1. 部分比對斷言（等同原本 toMatchObject 的 property matcher），
 *    以 any(String) 比對 $0 以忽略執行檔路徑差異
 * 2. 原生快照驗證 t.assert.snapshot，保留原本的 snapshot 比對；
 *    因原生快照不支援 property matcher，記錄前先將 $0 替換為固定佔位值，
 *    使快照內容不受本機路徑影響
 * Verification has two layers, matching the original Jest behaviour:
 * 1. a partial-match assertion (equivalent to the former toMatchObject property
 *    matchers), where $0 is matched with any(String) to ignore executable path
 *    differences
 * 2. the native snapshot check t.assert.snapshot, preserving the original
 *    snapshot comparison; since native snapshots support no property matchers,
 *    $0 is replaced by a fixed placeholder before recording so snapshot
 *    contents stay independent of local paths
 *
 * @template T - 期望的屬性類型 / Type of the expected properties
 * @param {TestContext} t - 測試上下文，用於記錄與比對快照 / Test context, used to record and compare snapshots
 * @param {string[]} inputArgv - 輸入的命令列參數 / Input command line arguments
 * @param {object} [expectObject] - 期望比對的屬性物件，值可為一般值或 matcher / Expected properties; values may be plain values or matchers
 * @returns parseArgv 的返回值 / The parseArgv return value
 */
function _parseArgvMatchObject<T extends IYPXArguments = IYPXArguments>(t: TestContext, inputArgv: string[], expectObject?: { [K in keyof T]?: unknown })
{
	const actual = parseArgv(inputArgv);

	/* 第一層：部分比對斷言 / Layer 1: partial-match assertion */
	const mismatch = findMismatch(actual, {
		$0: expect.any(String),
		...expectObject,
	}, 'actual');

	if (mismatch !== null)
	{
		assert.fail(`輸入 ${inspect(inputArgv)} 的解析結果不符預期 / parse result mismatch for input ${inspect(inputArgv)}\n${mismatch}`);
	}

	/* 第二層：原生快照驗證（$0 以佔位值取代）/ Layer 2: native snapshot check ($0 replaced by a placeholder) */
	t.assert.snapshot({ ...actual, $0: '<$0>' });

	return actual;
}

/**
 * 基本功能測試
 * Basic functionality tests
 */

test(`Basic argument parsing`, (t) =>
{
	let inputArgv = [
		'-p',
		'ncu2',
		'-p',
		'ncu',
		'ncu',
		'-u',
	];

	_parseArgvMatchObject(t, inputArgv, {
		package: ['ncu2', 'ncu'],
		_: ['ncu'],
		'--': ['-u'],
	});

});

test(`test2`, (t) =>
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

	_parseArgvMatchObject(t, inputArgv, {
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

		test(inspect(inputArgv), (t) => {

			_parseArgvMatchObject(t, inputArgv);

		})

	})

})

/**
 * 選項功能測試
 * Option functionality tests
 */
describe(`Option tests`, () => {

	/**
	 * 測試靜默模式選項
	 * Test quiet mode option
	 */
	test(`quiet option`, (t) => {
		_parseArgvMatchObject(t, ['-q', 'mocha'], {
			quiet: true,
			q: true,
		});
	});

	/**
	 * 測試優先離線選項
	 * Test prefer offline option
	 */
	test(`preferOffline option`, (t) => {
		_parseArgvMatchObject(t, ['--prefer-offline', 'npm'], {
			preferOffline: true,
		});
	});

	/**
	 * 測試忽略已存在選項
	 * Test ignore existing option
	 */
	test(`ignoreExisting option`, (t) => {
		_parseArgvMatchObject(t, ['--ignore-existing', 'jest'], {
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
	test(`noInstall option`, (t) => {
		_parseArgvMatchObject(t, ['--no-install', 'eslint'], {
			install: false,
		});
	});

	/**
	 * 測試除錯模式選項
	 * Test debug mode option
	 */
	test(`debugMode option`, (t) => {
		_parseArgvMatchObject(t, ['--debug-mode', 'node'], {
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
	test(`userconfig option`, (t) => {
		_parseArgvMatchObject(t, ['--userconfig', '/path/to/.yarnrc', 'yarn'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});
	});

	/**
	 * 測試 userconfig 別名
	 * Test userconfig aliases
	 */
	test(`userconfig aliases`, (t) => {
		_parseArgvMatchObject(t, ['--useYarnrc', '/config/.yarnrc', 'node'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});

		_parseArgvMatchObject(t, ['--rc', '/root/.yarnrc', 'npm'], {
			userconfig: expect.stringContaining('.yarnrc'),
		});
	});

	/**
	 * 測試 npmClient 選項
	 * Test npmClient option
	 */
	test(`npmClient option`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--pm', 'yarn', 'mocha'], {
			npmClient: ['yarn'],
		});
		assertLength(actual.npmClient, 1, `npmClient`);
	});

	/**
	 * 測試多個 npmClient
	 * Test multiple npmClients
	 */
	test(`Multiple npmClients`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--pm', 'yarn', '--pm', 'pnpm', '--npmClient', 'npm', 'mocha'], {
			npmClient: ['yarn', 'pnpm', 'npm'],
		});
		assertLength(actual.npmClient, 3, `npmClient`);
	});

	/**
	 * 測試 --npmClient 長選項
	 * Test --npmClient long option
	 */
	test(`--npmClient long option`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--npmClient', 'pnpm', 'node'], {
			npmClient: ['pnpm'],
		});
		assertLength(actual.npmClient, 1, `npmClient`);
	});

	/**
	 * 測試 verbose 選項會將 quiet 設為 false
	 * Test verbose option sets quiet to false
	 */
	test(`verbose option sets quiet to false`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--verbose', 'mocha'], {
			verbose: true,
			quiet: false,
		});
		assert.strictEqual(actual.verbose, true, `verbose 應為 true / verbose should be true`);
		assert.strictEqual(actual.quiet, false, `quiet 應為 false / quiet should be false`);
	});

	/**
	 * 測試僅啟用 verbose（未指定 quiet）
	 * Test verbose only (quiet not specified)
	 */
	test(`verbose only`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--verbose', 'jest'], {
			verbose: true,
			quiet: false,
		});
		assert.strictEqual(actual.verbose, true, `verbose 應為 true / verbose should be true`);
		assert.strictEqual(actual.quiet, false, `quiet 應為 false / quiet should be false`);
	});

});

/**
 * package 選項測試
 * Package option tests
 */
describe(`package 選項測試`, () => {

	/**
	 * 測試單個 package 被轉換為陣列
	 * Test single package is converted to array
	 */
	test(`Single package to array`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', 'lodash', 'node'], {
			package: expect.arrayContaining(['lodash']),
		});
		assertLength(actual.package, 1, `package`);
	});

	/**
	 * 測試多個 package
	 * Test multiple packages
	 */
	test(`Multiple packages`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', 'jest', '-p', 'mocha', '-p', 'vitest', 'test'], {
			package: expect.arrayContaining(['jest', 'mocha', 'vitest']),
		});
		assertLength(actual.package, 3, `package`);
	});

	/**
	 * 測試 --package 長選項
	 * Test --package long option
	 */
	test(`--package long option`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--package', 'typescript', 'tsc'], {
			package: expect.arrayContaining(['typescript']),
		});
		assertLength(actual.package, 1, `package`);
	});

});

/**
 * 邊界案例測試
 * Edge case tests
 */
describe(`邊界案例`, () => {

	/**
	 * 測試無命令的情況
	 * Test no command scenario
	 */
	test(`No command`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', 'lodash'], {
			_: expect.any(Array),
			package: expect.arrayContaining(['lodash']),
		});
		assertLength(actual._, 0, `_`);
	});

	/**
	 * 測試空參數陣列
	 * Test empty arguments array
	 *
	 * 注意：無輸入時 -- 屬性為 undefined
	 * Note: -- property is undefined when no input provided
	 */
	test(`Empty arguments array`, () => {
		const actual = parseArgv([]);
		assert.deepStrictEqual(actual._, [], `空輸入的 _ 應為空陣列 / _ should be an empty array for empty input`);
		// 無 -- 時屬性為 undefined / Property is undefined when no -- present
		assert.strictEqual(actual['--'], undefined, `空輸入時 -- 應為 undefined / -- should be undefined for empty input`);
	});

	/**
	 * 測試僅有命令
	 * Test command only
	 */
	test(`Command only`, (t) => {
		const actual = _parseArgvMatchObject(t, ['node'], {
			_: expect.arrayContaining(['node']),
			'--': expect.any(Array),
		});
		assertLength(actual._, 1, `_`);
	});

	/**
	 * 測試多個位置參數
	 * Test multiple positional arguments
	 *
	 * 注意：解析邏輯將命令後的參數移到 `--`
	 * Note: Parsing logic moves arguments after command to `--`
	 */
	test(`Multiple positional arguments`, (t) => {
		const actual = _parseArgvMatchObject(t, ['node', 'script.js', 'arg1'], {
			// 第一個位置參數是命令 / First positional is the command
			_: expect.arrayContaining(['node']),
			// 後面的參數移到 `--` / Remaining args moved to `--`
			'--': expect.arrayContaining(['script.js', 'arg1']),
		});
		assertLength(actual._, 1, `_`);
		assertLength(actual['--'], 2, `--`);
	});

	/**
	 * 測試 -- 後無參數
	 * Test no arguments after --
	 */
	test(`No args after --`, (t) => {
		const actual = _parseArgvMatchObject(t, ['mocha', '--'], {
			_: expect.arrayContaining(['mocha']),
			'--': expect.any(Array),
		});
		assertLength(actual._, 1, `_`);
		assertLength(actual['--'], 0, `--`);
	});

	/**
	 * 測試選項值與命令同名
	 * Test option value same as command name
	 */
	test(`選項值與命令同名`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', 'mocha', 'mocha', '--', '-R', 'spec'], {
			package: expect.arrayContaining(['mocha']),
			_: expect.arrayContaining(['mocha']),
			'--': expect.arrayContaining(['-R', 'spec']),
		});
		assertLength(actual.package, 1, `package`);
		assertLength(actual._, 1, `_`);
		assertLength(actual['--'], 2, `--`);
	});

});

/**
 * 複雜場景測試
 * Complex scenario tests
 */
describe(`複雜場景`, () => {

	/**
	 * 測試多個選項組合
	 * Test multiple options combination
	 */
	test(`多選項組合`, (t) => {
		_parseArgvMatchObject(t, [
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
	test(`帶版本的套件`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', 'lodash@4.17.21', 'node'], {
			package: expect.arrayContaining(['lodash@4.17.21']),
		});
		assertLength(actual.package, 1, `package`);
	});

	/**
	 * 測試 scoped package
	 * Test scoped package
	 */
	test(`scoped package`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', '@types/node', 'tsc'], {
			package: expect.arrayContaining(['@types/node']),
		});
		assertLength(actual.package, 1, `package`);
	});

	/**
	 * 測試 scoped package 帶版本
	 * Test scoped package with version
	 */
	test(`scoped package 帶版本`, (t) => {
		const actual = _parseArgvMatchObject(t, ['-p', '@types/node@18.0.0', 'tsc'], {
			package: expect.arrayContaining(['@types/node@18.0.0']),
		});
		assertLength(actual.package, 1, `package`);
	});

	test(`--package=yo --package=generator-webapp`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--package=yo', '--package=generator-webapp'], {
			package: ['yo', 'generator-webapp'],
		});
		assertLength(actual.package, 2, `package`);
	});

	test(`--package=yo --package generator-webapp`, (t) => {
		const actual = _parseArgvMatchObject(t, ['--package=yo', '--package', 'generator-webapp'], {
			package: ['yo', 'generator-webapp'],
		});
		assertLength(actual.package, 2, `package`);
	});

});
