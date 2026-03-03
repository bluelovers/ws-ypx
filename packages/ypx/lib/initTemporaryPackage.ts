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
import { writeFile, writeJSON } from 'fs-extra';
import { join } from "path";
import { buildConfig } from './initConfig';
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
export function initTemporaryPackage(tmpDir: string, argv: Required<IYPXArguments>)
{
	/**
	 * 建置設定檔內容
	 * Build configuration file contents
	 */
	let data = buildConfig(argv);

	/**
	 * 同時寫入所有設定檔
	 * Write all config files concurrently
	 */
	return Bluebird.all([
		/** 寫入 Yarn RC 設定檔 / Write Yarn RC config file */
		writeFile(join(tmpDir, '.yarnrc'), data.rc),
		/** 寫入 npm RC 設定檔 / Write npm RC config file */
		writeFile(join(tmpDir, '.npmrc'), data.npmrc),
		/** 寫入 Yarn YAML 設定檔 / Write Yarn YAML config file */
		writeFile(join(tmpDir, '.yarnrc.yml'), data.yml),
		/** 建立空的 yarn.lock 檔案 / Create empty yarn.lock file */
		writeFile(join(tmpDir, 'yarn.lock'), ``),
		/** 寫入基本 package.json / Write basic package.json */
		writeJSON(join(tmpDir, 'package.json'), {
			"license": "ISC",
		}),
	])
}

export default initTemporaryPackage
