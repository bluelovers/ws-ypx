import Bluebird from 'bluebird';
/**
 * 取得快取目錄路徑
 * Get cache directory path
 *
 * 優先從 Yarn 設定取得 tempFolder，若失敗則使用環境變數 YARN_CACHE_FOLDER
 * Prioritizes getting tempFolder from Yarn config, falls back to YARN_CACHE_FOLDER environment variable
 *
 * @returns {string} 快取目錄路徑 / Cache directory path
 */
export declare function getCacheDir(): string;
/**
 * 建立臨時目錄
 * Create temporary directory
 *
 * 使用 tmp 套件建立臨時目錄，目錄名稱前綴為 'ypx_'
 * Uses tmp package to create temporary directory with 'ypx_' prefix
 *
 * @returns {Bluebird<string>} 臨時目錄路徑 / Temporary directory path
 */
export declare function createTemporaryDirectory(): Bluebird<string>;
/**
 * 建立新的臨時目錄物件
 * Create new temporary directory object
 *
 * 返回包含臨時目錄路徑和移除方法的物件，便於管理臨時檔案
 * Returns object with temporary directory path and remove method for easy temp file management
 *
 * @returns {Promise<{tmpDir: string, remove: () => Promise<void>}>} 臨時目錄物件 / Temporary directory object
 */
export declare function newTemporary(): Promise<{
    /**
     * 取得臨時目錄路徑（getter）
     * Get temporary directory path (getter)
     */
    readonly tmpDir: string;
    /**
     * 移除臨時目錄
     * Remove temporary directory
     *
     * @returns {Promise<void>}
     */
    remove(): Promise<void>;
}>;
export default createTemporaryDirectory;
