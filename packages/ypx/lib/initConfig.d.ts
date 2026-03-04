/**
 * 配置初始化模組
 * Configuration Initialization Module
 *
 * 負責處理 YPX 工具的設定檔生成與正規化
 * Handles configuration file generation and normalization for YPX tool
 *
 * @author bluelovers
 * @since 2020-01-30
 */
import { IYPXArguments } from '@ynpx/ynpx-argv';
/**
 * 取得預設配置物件
 * Get default configuration object
 *
 * 定義 YPX 執行時的預設行為設定
 * Defines default behavior settings for YPX execution
 *
 * @returns {Record<string, any>} 預設配置物件 / Default configuration object
 */
export declare function defaultConfig(): {
    enableGlobalCache: boolean;
    disableSelfUpdateCheck: boolean;
    noUpdateNotifier: boolean;
    updateNotifier: boolean;
    preferOffline: boolean;
    emoji: boolean;
};
/**
 * 正規化配置物件的鍵名
 * Normalize configuration object keys
 *
 * 將所有配置鍵名轉換為 camelCase 格式，同時移除重複的 kebab-case 鍵名
 * Converts all configuration keys to camelCase format while removing duplicate kebab-case keys
 *
 * 邏輯說明：
 * 1. 遍歷所有配置鍵名
 * 2. 產生 camelCase 和 kebab-case 版本的鍵名
 * 3. 若 camelCase 鍵名不存在，則賦值
 * 4. 若原始鍵名是 kebab-case 且已建立 camelCase 版本，則刪除 kebab-case 鍵名
 *
 * Logic explanation:
 * 1. Iterate through all config keys
 * 2. Generate camelCase and kebab-case versions of keys
 * 3. Assign value if camelCase key doesn't exist
 * 4. Delete kebab-case key if original is kebab-case and camelCase version exists
 *
 * @param {Record<string, any>} userconfig - 使用者配置物件 / User configuration object
 * @returns {Record<string, any>} 正規化後的配置物件 / Normalized configuration object
 */
export declare function normalizeConfig(userconfig: Record<string, any>): Record<string, any>;
/**
 * 將命令列參數轉換為配置物件
 * Convert command line arguments to configuration object
 *
 * 從 IYPXArguments 提取相關設定並合併到使用者配置中
 * Extracts relevant settings from IYPXArguments and merges into user configuration
 *
 * 目前支援的參數：
 * - preferOffline: 優先使用離線快取
 * - shamefullyHoist: 建立扁平 node_modules 結構（適用於 pnpm）
 *
 * Currently supported arguments:
 * - preferOffline: Prefer offline cache
 * - shamefullyHoist: Create flat node_modules structure (for pnpm)
 *
 * @param {IYPXArguments} argv - 解析後的命令列參數 / Parsed command line arguments
 * @param {Record<string, any>} userconfig - 初始使用者配置（可選）/ Initial user configuration (optional)
 * @returns {Record<string, any>} 合併後的配置物件 / Merged configuration object
 */
export declare function handleOptionsToConfig(argv: IYPXArguments, userconfig?: Record<string, any>): Record<string, any>;
/**
 * 建置完整的配置檔內容
 * Build complete configuration file contents
 *
 * 整合預設配置、使用者配置與命令列參數，生成三種格式的配置檔內容：
 * - rc: Yarn RC 格式（空格分隔）
 * - npmrc: npm RC 格式（等號分隔）
 * - yml: YAML 格式
 *
 * Integrates default config, user config, and CLI arguments to generate three format outputs:
 * - rc: Yarn RC format (space-separated)
 * - npmrc: npm RC format (equals-separated)
 * - yml: YAML format
 *
 * 輸出格式說明：
 * 1. 所有鍵名按字母順序排序（不區分大小寫）
 * 2. 每個配置項會產生三種鍵名格式：原始鍵名、camelCase、kebab-case
 * 3. YAML 格式僅使用 camelCase 鍵名
 *
 * Output format explanation:
 * 1. All keys sorted alphabetically (case-insensitive)
 * 2. Each config entry generates three key formats: original, camelCase, kebab-case
 * 3. YAML format uses only camelCase keys
 *
 * @param {IYPXArguments} argv - 解析後的命令列參數 / Parsed command line arguments
 * @param {Record<string, any>} userconfig - 使用者配置物件（可選）/ User configuration object (optional)
 * @returns {{rc: string, npmrc: string, yml: string}} 三種格式的配置檔內容 / Configuration contents in three formats
 */
export declare function buildConfig(argv: IYPXArguments, userconfig?: Record<string, any>): {
    /** Yarn RC / Yarn RC format */
    rc: string;
    /** npm/pnpm RC / npm/pnpm RC format*/
    npmrc: string;
    /** YAML 格式 / YAML format */
    yml: string;
};
/**
 * 預設匯出 buildConfig 函數
 * Default export of buildConfig function
 *
 * 提供給需要直接匯入使用的模組
 * Provided for modules that need direct import usage
 */
export default buildConfig;
