#!/usr/bin/env node
"use strict";
/**
 * YPX CLI 入口點
 * YPX CLI Entry Point
 *
 * YPX 命令列介面的主要入口檔案，負責解析參數並調用核心模組
 * Main entry file for YPX CLI, responsible for parsing arguments and invoking core module
 *
 * @author bluelovers
 * @since 2020-01-28
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = require("../index");
const util_1 = require("util");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const err_1 = require("../lib/err");
const ynpx_argv_1 = require("@ynpx/ynpx-argv");
/**
 * 從程序參數中提取輸入參數（排除 node 和腳本路徑）
 * Extract input arguments from process parameters (excluding node and script path)
 */
let inputArgv = process.argv.slice(2);
// updateNotifier([__dirname, '..']);
/**
 * 解析命令列參數
 * Parse command line arguments
 */
let argv = (0, ynpx_argv_1.parseArgv)(inputArgv);
/**
 * 調試模式：輸出二進制文件路徑
 * Debug mode: output binary file path
 */
if (argv.debugBin) {
    console.log(__filename);
    process.exit();
}
/**
 * 提取套件參數
 * Extract package arguments
 */
let { p = [] } = argv;
/**
 * 驗證並規範化套件列表
 * Validate and normalize package list
 */
if (!p || !p.length) {
    if (argv._.length !== 1) {
        throw new Error(`current not support this syntax, ${(0, util_1.inspect)(argv)}`);
    }
    else {
        // @ts-ignore
        p = [argv._.shift()];
    }
}
/*
if (argv._.length && argv['--'].length)
{
    throw new Error(`current not support this syntax, ${inputArgv}`)
}
 */
/**
 * 執行 YPX 主流程
 * Execute YPX main flow
 */
bluebird_1.default.resolve()
    .then(() => (0, index_1.YPX)({
    ...argv,
    package: p,
}, inputArgv))
    /**
     * 捕獲 YpxError 並處理程序退出碼
     * Catch YpxError and handle process exit code
     */
    .catch(err_1.YpxError, (e) => {
    process.exit(e.exitCode);
})
    .tapCatch((e) => {
    var _a;
    process.exitCode || (process.exitCode = (_a = e === null || e === void 0 ? void 0 : e.exitCode) !== null && _a !== void 0 ? _a : 1);
})
    .tap((e) => {
    if (e && e instanceof err_1.YpxError) {
        process.exit(e.exitCode);
    }
});
//# sourceMappingURL=ypx.js.map