"use strict";
/**
 * 錯誤處理模組
 * Error Handling Module
 *
 * 定義 YPX 工具專用的錯誤類別，用於區分 YPX 內部錯誤與其他錯誤
 * Defines YPX tool-specific error class for distinguishing internal errors from other errors
 *
 * @author bluelovers
 * @since 2020-01-30
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YpxError = void 0;
/**
 * YPX 專用錯誤類別
 * YPX-specific error class
 *
 * 用於表示 YPX 工具執行過程中的特定錯誤，包含退出碼資訊
 * Used to represent specific errors during YPX tool execution, including exit code information
 */
class YpxError extends Error {
    /**
     * 建立 YPX 錯誤實例
     * Create YPX error instance
     *
     * @param {number} [exitCode] - 程序退出碼 / Process exit code
     */
    constructor(exitCode) {
        /**
         * 呼叫父類別建構子，傳入退出碼字串
         * Call parent class constructor with exit code string
         */
        super(String(exitCode));
        this.exitCode = exitCode;
        /**
         * 錯誤名稱，固定為 'YpxError' 以便識別
         * Error name, fixed as 'YpxError' for identification
         */
        this.name = 'YpxError';
    }
}
exports.YpxError = YpxError;
//# sourceMappingURL=err.js.map