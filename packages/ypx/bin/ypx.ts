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

import { YPX } from '../index';
import { inspect } from 'util'
import Bluebird from 'bluebird';
import { updateNotifier } from '@yarn-tool/update-notifier';
import { YpxError } from '../lib/err';
import { parseArgv } from '@ynpx/ynpx-argv';

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
let argv = parseArgv(inputArgv);

/**
 * 調試模式：輸出二進制文件路徑
 * Debug mode: output binary file path
 */
if (argv.debugBin)
{
	console.log(__filename);
	process.exit();
}

/**
 * 提取套件參數
 * Extract package arguments
 */
let { p = [] } = argv as typeof argv & {
	p: string[],
};

/**
 * 驗證並規範化套件列表
 * Validate and normalize package list
 */
if (!p || !p.length)
{
	if (argv._.length !== 1)
	{
		throw new Error(`current not support this syntax, ${inspect(argv)}`)
	}
	else
	{
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
Bluebird.resolve()
	.then(() => YPX({
		...argv,
		package: p,
	}, inputArgv))
	/**
	 * 捕獲 YpxError 並處理程序退出碼
	 * Catch YpxError and handle process exit code
	 */
	.catch(YpxError, (e) =>
	{
		process.exit(e.exitCode);
	})
	.tapCatch((e) =>
	{
		process.exitCode ||= (e?.exitCode ?? 1);
	})
	.tap((e) =>
	{
		if (e && e instanceof YpxError)
		{
			process.exit(e.exitCode);
		}
	})
;
