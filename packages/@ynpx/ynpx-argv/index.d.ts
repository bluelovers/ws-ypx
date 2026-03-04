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
export interface IYPXArgumentsCore {
    /** 要安裝的套件列表 / List of packages to install */
    package: string[];
    /** 靜默模式，抑制輸出 / Quiet mode, suppress output */
    quiet?: boolean;
    /** 優先使用離線快取 / Prefer offline cache */
    preferOffline?: boolean;
    /** 工作目錄 / Working directory */
    cwd?: string;
    /** 忽略已存在的套件檢查 / Skip checking if packages exist */
    ignoreExisting?: boolean;
    /** 跳過套件安裝 / Skip package installation */
    noInstall?: boolean;
    /**
     * 指定 Yarn 使用的 yarnrc 設定檔（僅支援 .yarnrc，不支援 .npmrc）
     * Specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)
     */
    userconfig?: string;
    /**
     * 僅供 CLI 測試使用
     * For CLI test only
     */
    debugBin?: boolean;
    /**
     * yargs 內建幫助選項（已棄用）
     * yargs built-in help option (deprecated)
     * @deprecated
     */
    help?: boolean;
    /** 除錯模式 / Debug mode */
    debugMode?: boolean;
    /**
     * 指定要使用的套件管理器（可多次指定，例如 npm、yarn、pnpm）
     * Specify the package manager to use (can be specified multiple times, e.g., npm, yarn, pnpm)
     */
    npmClient?: string[];
    /**
     * 创建一个扁平的 node_modules 结构，类似于 npm 或 yarn
     * Create a flat node_modules structure similar to npm or yarn
     *
     * 作用於 npmClient: pnpm
     */
    shamefullyHoist?: boolean;
}
/**
 * YPX 完整參數介面（包含 yargs 內建屬性和 `--` 分隔的參數）
 * YPX Full Arguments Interface (includes yargs built-in properties and `--` separated arguments)
 *
 * 擴展自 yargs Arguments，新增 `--` 陣列用於存儲命令後面的額外參數
 * Extended from yargs Arguments, adds `--` array for storing extra arguments after the command
 */
export interface IYPXArguments extends Arguments<IYPXArgumentsCore> {
    /** `--` 後面的額外參數陣列 / Array of extra arguments after `--` */
    "--": string[];
}
/**
 * 帶有 populate-- 配置的 Argv 類型轉換輔助類型
 * Argv Type Transformation Helper with populate-- configuration
 *
 * 將 yargs 的 Argv 類型轉換為包含 string[] 類型的 package 和 '--' 屬性
 * Transforms yargs Argv type to include string[] typed package and '--' properties
 */
type IArgvWithPopulate<T extends Argv<Omit<IYPXArguments, 'package' | 'npmClient'>>> = T extends Argv<infer R> ? Argv<Omit<R, 'package' | 'npmClient'> & {
    package: string[];
    npmClient?: string[];
    '--': string[];
}> : never;
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
export declare function parseArgv(inputArgv: string[]): {
    [x: string]: unknown;
    quiet: boolean;
    preferOffline: boolean;
    ignoreExisting: boolean;
    noInstall: boolean;
    userconfig: string;
    debugBin: boolean;
    debugMode: boolean;
    package: string[];
    npmClient?: string[];
    "--": string[];
    _: (string | number)[];
    $0: string;
};
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
export declare function parseArgvCore(inputArgv: string[]): IArgvWithPopulate<yargs.Argv<{
    package: string;
} & {
    quiet: boolean;
} & {
    ignoreExisting: boolean;
} & {
    noInstall: boolean;
} & {
    preferOffline: boolean;
} & {
    debugBin: boolean;
} & {
    debugMode: boolean;
} & {
    userconfig: string;
} & {
    npmClient: string;
}>>;
/**
 * 預設匯出 parseArgv 函數
 * Default export of parseArgv function
 *
 * 提供給需要直接匯入使用的模組
 * Provided for modules that need direct import usage
 */
export default parseArgv;
