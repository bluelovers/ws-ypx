"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTemporaryPackage = initTemporaryPackage;
const tslib_1 = require("tslib");
/**
 * 臨時套件初始化模組
 * Temporary Package Initialization Module
 *
 * 負責在臨時目錄中初始化套件結構，建立必要的設定檔
 * Responsible for initializing package structure in temporary directory, creating necessary config files
 *
 * @author bluelovers
 * @since 2020-01-29
 */
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const initConfig_1 = require("./initConfig");
/**
 * 初始化臨時套件目錄
 * Initialize temporary package directory
 *
 * 建立 Yarn、npm 設定檔以及基本的 package.json
 * Creates Yarn, npm config files and basic package.json
 *
 * @param {string} tmpDir - 臨時目錄路徑 / Temporary directory path
 * @param {Required<IYPXArguments>} argv - YPX 參數 / YPX arguments
 * @returns {Bluebird<[void, void, void, void, void]>} 寫入檔案的 Promise / Promise for writing files
 */
function initTemporaryPackage(tmpDir, argv) {
    /**
     * 建置設定檔內容
     * Build configuration file contents
     */
    let data = (0, initConfig_1.buildConfig)(argv);
    /**
     * 同時寫入所有設定檔
     * Write all config files concurrently
     */
    return bluebird_1.default.all([
        /** 寫入 Yarn RC 設定檔 / Write Yarn RC config file */
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, '.yarnrc'), data.rc),
        /** 寫入 npm RC 設定檔 / Write npm RC config file */
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, '.npmrc'), data.npmrc),
        /** 寫入 Yarn YAML 設定檔 / Write Yarn YAML config file */
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, '.yarnrc.yml'), data.yml),
        /** 建立空的 yarn.lock 檔案 / Create empty yarn.lock file */
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, 'yarn.lock'), ``),
        /** 寫入基本 package.json / Write basic package.json */
        (0, fs_extra_1.writeJSON)((0, path_1.join)(tmpDir, 'package.json'), {
            "license": "ISC",
        }),
    ]);
}
exports.default = initTemporaryPackage;
//# sourceMappingURL=initTemporaryPackage.js.map