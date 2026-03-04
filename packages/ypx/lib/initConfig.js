"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = defaultConfig;
exports.normalizeConfig = normalizeConfig;
exports.handleOptionsToConfig = handleOptionsToConfig;
exports.buildConfig = buildConfig;
const lodash_1 = require("lodash");
/**
 * 取得預設配置物件
 * Get default configuration object
 *
 * 定義 YPX 執行時的預設行為設定
 * Defines default behavior settings for YPX execution
 *
 * @returns {Record<string, any>} 預設配置物件 / Default configuration object
 */
function defaultConfig() {
    return {
        'enableGlobalCache': true,
        'disableSelfUpdateCheck': true,
        'noUpdateNotifier': true,
        'updateNotifier': false,
        'preferOffline': true,
        'emoji': true,
    };
}
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
function normalizeConfig(userconfig) {
    var _a;
    // 遍歷配置物件中的所有鍵名
    // Iterate through all keys in config object
    for (const key in userconfig) {
        /** 當前鍵值 / Current key value */
        let value = userconfig[key];
        /** camelCase 格式的鍵名 / camelCase formatted key */
        let ck = (0, lodash_1.camelCase)(key);
        /** kebab-case 格式的鍵名 / kebab-case formatted key */
        let kk = (0, lodash_1.kebabCase)(key);
        // 若 camelCase 鍵名不存在，則使用空值合併運算子賦值
        // Assign value using nullish coalescing if camelCase key doesn't exist
        (_a = userconfig[ck]) !== null && _a !== void 0 ? _a : (userconfig[ck] = value);
        // 若 camelCase 與原始鍵名不同，且原始鍵名為 kebab-case，則刪除原始鍵名
        // Delete original key if camelCase differs and original is kebab-case
        if (ck !== key) {
            if (kk === key) {
                delete userconfig[kk];
            }
        }
    }
    return userconfig;
}
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
function handleOptionsToConfig(argv, userconfig = {}) {
    // 建立配置的淺拷貝以避免修改原始物件
    // Create shallow copy of config to avoid modifying original object
    userconfig = {
        ...userconfig,
    };
    // 若啟用離線優先，設定對應配置項
    // Set preferOffline if enabled in arguments
    if (argv.preferOffline) {
        userconfig['preferOffline'] = true;
    }
    // 若啟用 shamefully-hoist（扁平化 node_modules），設定對應配置項
    // Set shamefullyHoist if enabled in arguments (for pnpm flat structure)
    if (argv.shamefullyHoist) {
        userconfig['shamefullyHoist'] = true;
    }
    return userconfig;
}
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
function buildConfig(argv, userconfig = {}) {
    // 合併預設配置、命令列選項與使用者配置，並正規化鍵名
    // Merge default config, CLI options, and user config, then normalize keys
    userconfig = normalizeConfig((0, lodash_1.defaultsDeep)(handleOptionsToConfig(argv, userconfig), defaultConfig()));
    // 將配置物件排序並轉換為三種格式
    // Sort config object and transform into three formats
    let o = Object.entries(userconfig).sort(([a], [b]) => a.toLocaleLowerCase().localeCompare(b))
        .reduce((a, [key, value]) => {
        /** camelCase 格式的鍵名 / camelCase formatted key */
        let ck = (0, lodash_1.camelCase)(key);
        /** kebab-case 格式的鍵名 / kebab-case formatted key */
        let kk = (0, lodash_1.kebabCase)(key);
        // Yarn RC 格式：使用空格分隔鍵值
        // Yarn RC format: space-separated key-value pairs
        a.rc.push(`${key} ${value}`);
        // 若 camelCase 不同則額外加入
        // Add camelCase version if different
        key !== ck && a.rc.push(`${ck} ${value}`);
        // 若 kebab-case 不同則額外加入
        // Add kebab-case version if different
        (key !== kk && kk !== ck) && a.rc.push(`${kk} ${value}`);
        // npm RC 格式：使用等號分隔鍵值
        // npm RC format: equals-separated key-value pairs
        a.npmrc.push(`${key}=${value}`);
        key !== ck && a.npmrc.push(`${ck}=${value}`);
        (key !== kk && kk !== ck) && a.npmrc.push(`${kk}=${value}`);
        // YAML 格式：僅使用 camelCase 鍵名
        // YAML format: uses only camelCase keys
        a.yml.push(`${ck}: ${value}`);
        (ck !== kk && key !== ck) && a.yml.push(`${key}: ${value}`);
        return a;
    }, {
        /** Yarn RC 格式陣列 / Yarn RC format array */
        rc: [],
        /** npm/pnpm RC 格式陣列 / npm/pnpm RC format array */
        npmrc: [],
        /** YAML 格式陣列 / YAML format array */
        yml: [],
    });
    // 將陣列組合為字串，每行以換行符結尾
    // Join arrays into strings, each line ending with newline
    return {
        /** Yarn RC / Yarn RC format */
        rc: o.rc.join('\n') + '\n',
        /** npm/pnpm RC / npm/pnpm RC format*/
        npmrc: o.npmrc.join('\n') + '\n',
        /** YAML 格式 / YAML format */
        yml: o.yml.join('\n') + '\n',
    };
}
/**
 * 預設匯出 buildConfig 函數
 * Default export of buildConfig function
 *
 * 提供給需要直接匯入使用的模組
 * Provided for modules that need direct import usage
 */
exports.default = buildConfig;
//# sourceMappingURL=initConfig.js.map