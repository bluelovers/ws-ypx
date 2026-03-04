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
import Bluebird from 'bluebird';
import { IYPXArguments } from '@ynpx/ynpx-argv';
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
export declare function initTemporaryPackage(tmpDir: string, argv: Required<IYPXArguments>): Bluebird<[void, void, void, void, void]>;
export default initTemporaryPackage;
