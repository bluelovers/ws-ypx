/**
 * YPX 命令列參數解析模組
 * YPX Command Line Arguments Parsing Module
 *
 * 用於解析 ynpx 工具的命令列參數，支援套件安裝選項和執行參數分離
 * Used to parse command line arguments for the ynpx tool, supporting package installation options and execution parameter separation
 *
 * @author bluelovers
 * @since 2020-07-18
 */

import yargs, { Arguments, Argv } from 'yargs';

/**
 * YPX 核心參數介面
 * YPX Core Arguments Interface
 *
 * 定義 ynpx 命令列工具支援的所有配置選項
 * Defines all configuration options supported by the ynpx CLI tool
 */
export interface IYPXArgumentsCore
{
	/** 要安裝的套件列表 / List of packages to install */
	package: string[],
	/** 靜默模式，抑制輸出 / Quiet mode, suppress output */
	quiet?: boolean,
	/** 優先使用離線快取 / Prefer offline cache */
	preferOffline?: boolean,
	/** 工作目錄 / Working directory */
	cwd?: string,
	/** 忽略已存在的套件檢查 / Skip checking if packages exist */
	ignoreExisting?: boolean,
	/** 跳過套件安裝 / Skip package installation */
	noInstall?: boolean,

	/**
	 * 指定 Yarn 使用的 yarnrc 設定檔（僅支援 .yarnrc，不支援 .npmrc）
	 * Specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)
	 */
	userconfig?: string,

	/**
	 * 僅供 CLI 測試使用
	 * For CLI test only
	 */
	debugBin?: boolean,

	/**
	 * yargs 內建幫助選項（已棄用）
	 * yargs built-in help option (deprecated)
	 * @deprecated
	 */
	help?: boolean,

	/** 除錯模式 / Debug mode */
	debugMode?: boolean,

	/**
	 * 指定要使用的套件管理器（可多次指定，例如 npm、yarn、pnpm）
	 * Specify the package manager to use (can be specified multiple times, e.g., npm, yarn, pnpm)
	 */
	npmClient?: string[],

	/**
	 * 创建一个扁平的 node_modules 结构，类似于 npm 或 yarn
	 * Create a flat node_modules structure similar to npm or yarn
	 *
	 * 作用於 npmClient: pnpm
	 */
	shamefullyHoist?: boolean,
}

/**
 * YPX 完整參數介面（包含 yargs 內建屬性和 `--` 分隔的參數）
 * YPX Full Arguments Interface (includes yargs built-in properties and `--` separated arguments)
 *
 * 擴展自 yargs Arguments，新增 `--` 陣列用於存儲命令後面的額外參數
 * Extended from yargs Arguments, adds `--` array for storing extra arguments after the command
 */
export interface IYPXArguments extends Arguments<IYPXArgumentsCore>
{
	/** `--` 後面的額外參數陣列 / Array of extra arguments after `--` */
	"--": string[]
}

/**
 * 帶有 populate-- 配置的 Argv 類型轉換輔助類型
 * Argv Type Transformation Helper with populate-- configuration
 *
 * 將 yargs 的 Argv 類型轉換為包含 string[] 類型的 package 和 '--' 屬性
 * Transforms yargs Argv type to include string[] typed package and '--' properties
 */
type IArgvWithPopulate<T extends Argv<Omit<IYPXArguments, 'package' | 'npmClient'>>> = T extends Argv<infer R>
	? Argv<Omit<R, 'package' | 'npmClient'> & {
		package: string[];
		npmClient?: string[];
		'--': string[];
	}>
	: never;

/**
 * 解析命令列參數並返回解析結果
 * Parse command line arguments and return the parsed result
 *
 * 核心邏輯：
 * 1. 使用 yargs 解析基本參數
 * 2. 檢測命令位置，將命令後的參數分離到 `--` 陣列
 * 3. 將單個 package 字串轉換為陣列
 *
 * Core Logic:
 * 1. Use yargs to parse basic arguments
 * 2. Detect command position, separate arguments after command into `--` array
 * 3. Convert single package string to array
 *
 * @param {string[]} inputArgv - 原始命令列參數陣列 / Raw command line arguments array
 * @returns {IYPXArguments} 解析後的參數物件 / Parsed arguments object
 */
export function parseArgv(inputArgv: string[])
{
	// 建立 yargs 實例並解析參數
	// Create yargs instance and parse arguments
	let yg = parseArgvCore(inputArgv);
	let argv = yg.parseSync();

	/**
	 * 標記是否需要顯示幫助資訊
	 * Flag indicating whether to show help information
	 */
	let bool: boolean = true;

	/**
	 * 處理命令位置檢測和 `--` 參數分離
	 * Handle command position detection and `--` argument separation
	 *
	 * 當存在位置參數（命令）時，需要找出命令在原始參數中的位置
	 * 以便正確分離 ypx 選項和傳遞給被執行命令的參數
	 */
	if (argv._.length)
	{
		/** 命令在 inputArgv 中的結束位置 / End position of command in inputArgv */
		let found: number = -1;

		// 遍歷原始參數陣列尋找命令位置
		// Iterate through raw arguments array to find command position
		for (let i = 0; i < inputArgv.length; i++)
		{
			const prevArgv = inputArgv[i - 1];

			/**
			 * 跳過選項值（前一个是選項開關的參數）
			 * Skip option values (arguments where previous element is an option flag)
			 */
			if ([
				'--package',
				'-p',
				'--userconfig',
				'--useYarnrc',
				'--rc',
				'--cwd',
				'--npmClient',
				'--pm',
			].includes(prevArgv))
			{
				continue;
			}

			/**
			 * 找到命令位置：當前參數與解析後的第一個位置參數匹配
			 * Found command position: current argument matches the first positional argument after parsing
			 */
			if (inputArgv[i] === argv._[0])
			{
				// 驗證從當前位置開始的子陣列是否與解析後的位置參數匹配
				// Verify if sub-array from current position matches parsed positional arguments
				let ls = inputArgv.slice(i, i + 1)

				if (ls.every((value, index) => value === argv._[index]))
				{
					found = i + 1;
					break;
				}
			}
		}

		/**
		 * 找到命令位置後，重新解析參數並分離 `--` 後的內容
		 * After finding command position, re-parse arguments and separate content after `--`
		 */
		if (found !== -1)
		{
			// 標記不需要再次顯示幫助
			// Mark that help should not be shown again
			bool = false;

			// 使用命令前的參數重新建立 yargs 實例
			// Re-create yargs instance with arguments before command
			yg = parseArgvCore(inputArgv.slice(0, found));

			// @ts-ignore
			argv = yg
				.help(`h`)
				.showHelpOnFail(true)
				.argv
			;

			// 將命令後的參數存儲到 `--` 屬性
			// Store arguments after command in `--` property
			argv['--'] = inputArgv.slice(found);

			/**
			 * 如果 `--` 陣列第一個元素是 '--'，則移除它
			 * Remove first element if it's '--' (already handled by yargs parserConfiguration)
			 */
			if (argv['--'][0] === '--')
			{
				argv['--'].shift();
			}
		}
	}

	/**
	 * 將單個 package 字串正規化為陣列
	 * Normalize single package string to array
	 *
	 * 確保 package 屬性始終是字串陣列，即使只指定了一個套件
	 */
	if (typeof argv.package === 'string')
	{
		argv.package = [argv.package];
	}

	/**
	 * 將單個 npmClient 字串正規化為陣列
	 * Normalize single npmClient string to array
	 *
	 * 確保 npmClient 屬性始終是字串陣列，即使只指定了一個套件管理器
	 */
	if (typeof argv.npmClient === 'string')
	{
		// @ts-ignore
		argv.npmClient = [argv.npmClient];
	}

	/**
	 * 處理 verbose 選項：若啟用 verbose，則將 quiet 設為 false
	 * Handle verbose option: if verbose is enabled, set quiet to false
	 */
	if (argv.verbose)
	{
		argv.quiet = false;
	}

	/**
	 * 啟用幫助資訊顯示（如果尚未啟用）
	 * Enable help information display (if not already enabled)
	 */
	if (bool)
	{
		yg
			.help(`h`)
			.showHelpOnFail(true)
			.argv
		;
	}

	return argv
}

/**
 * 建立並配置 yargs 實例
 * Create and configure yargs instance
 *
 * 配置所有 YPX 支援的命令列選項，包括：
 * - package: 要安裝的套件（可多次指定）
 * - quiet: 靜默模式
 * - ignoreExisting: 忽略已存在檢查
 * - noInstall: 跳過安裝
 * - preferOffline: 優先離線
 * - debugBin: 除錯二進制
 * - debugMode: 除錯模式
 * - userconfig: Yarn 設定檔路徑
 *
 * Configure all YPX supported command line options, including:
 * - package: packages to install (can be specified multiple times)
 * - quiet: quiet mode
 * - ignoreExisting: skip existence check
 * - noInstall: skip installation
 * - preferOffline: prefer offline
 * - debugBin: debug binary
 * - debugMode: debug mode
 * - userconfig: Yarn config file path
 *
 * @param {string[]} inputArgv - 原始命令列參數陣列 / Raw command line arguments array
 * @returns {Argv} 配置好的 yargs 實例 / Configured yargs instance
 */
export function parseArgvCore(inputArgv: string[])
{
	/**
	 * 建立 yargs 實例並配置選項
	 * Create yargs instance and configure options
	 */
	const y = yargs(inputArgv)
		.parserConfiguration({
			/**
			 * 啟用 populate-- 選項，使 yargs 自動處理 `--` 後的參數
			 * Enable populate-- option to let yargs automatically handle arguments after `--`
			 */
			'populate--': true,
		})
		// 使用範例 / Usage examples
		.example(`$0 mocha`, `執行 mocha 套件 / Run mocha package`)
		.example(`$0 -p esm -p ts-node -p mocha -- -r esm`, `安裝多個套件並傳遞參數 / Install multiple packages and pass arguments`)
		.example(`$0 -q cowsay -- "ynpx"`, `靜默模式執行 / Run in quiet mode`)
		/**
		 * 設定套件選項
		 * Set package option
		 */
		.option('package', {
			desc: `定義要安裝的套件 / Define the package to be installed`,
			alias: 'p',
			//array: true, // 註解：yargs 的 array 類型在實際使用中有問題，改為手動處理
			string: true,
		})
		/**
		 * 設定靜默模式選項
		 * Set quiet mode option
		 */
		.option('quiet', {
			desc: `抑制 npx 本身的輸出（進度條、錯誤訊息、安裝報告）/ Suppress any output from npx itself (progress bars, error messages, install reports)`,
			alias: 'q',
			boolean: true,
		})
		.option('verbose', {
			desc: `顯示 npx 本身的輸出（不能與 quiet 同時啟用）/ Show output from npx itself (cannot be used with quiet)`,
			boolean: true,
			// 與 quiet 互斥 / Mutually exclusive with quiet
			conflicts: ['quiet'],
		})
		/**
		 * 設定忽略已存在選項
		 * Set ignore existing option
		 */
		.option('ignoreExisting', {
			desc: `跳過檢查套件是否已存在 / Skip check packages exists or not`,
			boolean: true,
			conflicts: ['noInstall'], // 與 noInstall 互斥 / Mutually exclusive with noInstall
		})
		/**
		 * 設定不安裝選項
		 * Set no install option
		 */
		.option('noInstall', {
			desc: `跳過安裝套件 / Skip install packages`,
			boolean: true,
		})
		/**
		 * 設定優先離線選項
		 * Set prefer offline option
		 */
		.option('preferOffline', {
			desc: `僅當本地快取中沒有相依套件時才使用網路 / Use network only if dependencies are not available in local cache`,
			boolean: true,
		})
		/**
		 * 設定除錯二進制選項
		 * Set debug binary option
		 */
		.option('debugBin', {
			desc: `僅供 CLI 測試使用 / For CLI test only`,
			boolean: true,
		})
		/**
		 * 設定除錯模式選項
		 * Set debug mode option
		 */
		.option('debugMode', {
			boolean: true,
		})
	/**
	 * 設定使用者設定檔選項
	 * Set user config option
	 */
	.option('userconfig', {
		desc: `指定 Yarn 使用的 yarnrc 檔案（僅 .yarnrc，非 .npmrc）/ Specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)`,
		alias: [
			'useYarnrc',
			'rc',
		],
		string: true,
		normalize: true, // 正規化路徑 / Normalize path
	})
	/**
	 * 設定套件管理器選項
	 * Set package manager option
	 */
	.option('npmClient', {
		desc: `指定要使用的套件管理器（例如：npm、yarn、pnpm）/ Specify the package manager to use (e.g., npm, yarn, pnpm)`,
		alias: [
			'pm',
		],
		string: true,
	})
;

	/**
	 * 使用類型斷言返回正確的類型
	 * Return with type assertion for correct typing
	 */
	return y as any as IArgvWithPopulate<typeof y>
}

/**
 * 預設匯出 parseArgv 函數
 * Default export of parseArgv function
 *
 * 提供給需要直接匯入使用的模組
 * Provided for modules that need direct import usage
 */
export default parseArgv;
