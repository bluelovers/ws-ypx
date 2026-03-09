"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
const lodash_1 = require("lodash");
const upath2_1 = require("upath2");
/**
 * 處理 YPX 參數選項
 * Handle YPX argument options
 *
 * 使用 deep clone 和 defaults 為參數設定預設值，並解析使用者設定檔路徑
 * Uses deep clone and defaults to set default values for arguments, and resolves user config file path
 *
 * @param {IYPXArgumentsInput} argv - 輸入的 YPX 參數 / Input YPX arguments
 * @returns {Required<IYPXArguments>} 處理後的完整參數 / Processed complete arguments
 */
function handleOptions(argv) {
    /**
     * 使用 defaultsDeep 為參數設定預設值
     * Use defaultsDeep to set default values for arguments
     */
    let result = (0, lodash_1.defaultsDeep)((0, lodash_1.cloneDeep)(argv), {
        /** 套件列表預設為空陣列 / Package list defaults to empty array */
        package: [],
        /** 位置參數預設為空陣列 / Positional arguments default to empty array */
        _: [],
        /** -- 後的參數預設為空陣列 / Arguments after -- default to empty array */
        "--": [],
        /** 靜默模式 / Quiet mode */
        quiet: true,
        /** 離線優先預設關閉 / Prefer offline defaults to off */
        preferOffline: false,
        /** 忽略已存在預設關閉 / Ignore existing defaults to off */
        ignoreExisting: false,
        /** 不安裝預設關閉 / No install defaults to off */
        noInstall: false,
        /** 工作目錄預設為目前目錄 / Working directory defaults to current directory */
        cwd: (0, upath2_1.normalize)(argv['cwd'] ? argv['cwd'] : process.cwd()),
    });
    /**
     * 若提供使用者設定檔路徑，解析為絕對路徑
     * If user config file path provided, resolve to absolute path
     */
    if (result.userconfig) {
        result.userconfig = (0, upath2_1.resolve)(result.cwd, result.userconfig);
    }
    return result;
}
exports.default = handleOptions;
//# sourceMappingURL=handleOptions.js.map