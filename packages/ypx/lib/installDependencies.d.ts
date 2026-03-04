import { ITSTypeAndStringLiteral } from 'ts-type';
import { IRuntimeCache } from './types';
import { IYPXArguments, IYPXArgumentsCore } from '@ynpx/ynpx-argv';
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
export declare function whichPackageManager(npmClients: IPackageManager[] | undefined): Promise<IPackageManager>;
export declare const enum EnumPackageManager {
    'yarn' = "yarn",
    'npm' = "npm",
    'pnpm' = "pnpm"
}
/**
 * 支援的套件管理器類型
 * Supported package manager types
 */
export type IPackageManager = ITSTypeAndStringLiteral<EnumPackageManager>;
/**
 * 套件管理器安裝參數配置介面
 * Package manager install arguments configuration interface
 */
interface IInstallArgsConfig extends Pick<IYPXArgumentsCore, 'package' | 'quiet' | 'preferOffline' | 'userconfig' | 'shamefullyHoist'> {
}
/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
export declare function _handleClientsToCheck(npmClients?: IPackageManager[] | undefined): IPackageManager[];
/**
 * 根據套件管理器類型產生安裝參數
 * Generate install arguments based on package manager type
 *
 * @param packageManager - 套件管理器名稱 / Package manager name
 * @param config - 安裝參數配置 / Install arguments configuration
 * @returns 指令參數陣列（已過濾空值）/ Command arguments array (null values filtered)
 */
export declare function getInstallArgs(packageManager: IPackageManager, config: IInstallArgsConfig): string[];
/**
 * 使用指定的套件管理器執行安裝
 * Execute installation with the specified package manager
 *
 * @param packageManager - 套件管理器名稱 / Package manager name
 * @param packages - 要安裝的套件列表 / List of packages to install
 * @param argv - YPX 參數 / YPX arguments
 * @param runtime - 執行時快取 / Runtime cache
 * @returns Promise 物件 / Promise object
 */
export declare function installWithPackageManager(packageManager: IPackageManager, packages: string[], argv: IYPXArguments, runtime: IRuntimeCache): Promise<void>;
/**
 * 安裝相依套件
 * Install dependencies
 *
 * @param argv - YPX 參數 / YPX arguments
 * @param runtime - 執行時快取 / Runtime cache
 */
export declare function installDependencies(argv: IYPXArguments, runtime: IRuntimeCache): Promise<void>;
export default installDependencies;
