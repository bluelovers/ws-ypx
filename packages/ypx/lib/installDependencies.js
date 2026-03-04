"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumPackageManager = void 0;
exports.whichPackageManager = whichPackageManager;
exports._handleClientsToCheck = _handleClientsToCheck;
exports.getInstallArgs = getInstallArgs;
exports.installWithPackageManager = installWithPackageManager;
exports.installDependencies = installDependencies;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const findCommand_1 = require("./findCommand");
const which_1 = tslib_1.__importDefault(require("which"));
/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 */
async function whichPackageManager(npmClients) {
    /**
     * 合併使用者指定的優先順序與預設順序
     * Merge user-specified priority with default order
     */
    const clientsToCheck = _handleClientsToCheck(npmClients);
    /**
     * 依序檢查每個套件管理器是否可用
     * Check each package manager sequentially for availability
     */
    for (const client of clientsToCheck) {
        const commandPath = await (0, which_1.default)(client).catch(() => null);
        if (commandPath) {
            return client;
        }
    }
    return clientsToCheck[0];
}
var EnumPackageManager;
(function (EnumPackageManager) {
    EnumPackageManager["yarn"] = "yarn";
    EnumPackageManager["npm"] = "npm";
    EnumPackageManager["pnpm"] = "pnpm";
})(EnumPackageManager || (exports.EnumPackageManager = EnumPackageManager = {}));
;
/**
 * 預設的套件管理器優先順序
 * Default package manager priority order
 */
const defaultClients = ["pnpm" /* EnumPackageManager.pnpm */, "yarn" /* EnumPackageManager.yarn */, "npm" /* EnumPackageManager.npm */];
/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 */
function _handleClientsToCheck(npmClients) {
    return (npmClients === null || npmClients === void 0 ? void 0 : npmClients.length)
        ? [...new Set([...npmClients, ...defaultClients])]
        : defaultClients;
}
/**
 * 根據套件管理器類型產生安裝參數
 * Generate install arguments based on package manager type
 *
 * @param packageManager - 套件管理器名稱 / Package manager name
 * @param config - 安裝參數配置 / Install arguments configuration
 * @returns 指令參數陣列（已過濾空值）/ Command arguments array (null values filtered)
 */
function getInstallArgs(packageManager, config) {
    const { package: packages, quiet, preferOffline, userconfig, shamefullyHoist } = config;
    /**
     * 基礎參數陣列
     * Base arguments array
     */
    let args = [];
    switch (packageManager) {
        case "yarn" /* EnumPackageManager.yarn */:
            args = [
                'add',
                ...packages,
                quiet ? '--quiet' : null,
                preferOffline ? '--prefer-offline' : null,
                '--link-duplicates',
                '--no-node-version-check',
                '--ignore-optional',
                userconfig ? '--use-yarnrc' : null,
                userconfig ? userconfig : null,
            ];
            break;
        case "npm" /* EnumPackageManager.npm */:
            args = [
                'install',
                ...packages,
                quiet ? '--quiet' : null,
                preferOffline ? '--prefer-offline' : null,
                '--no-save',
                userconfig ? '--userconfig' : null,
                userconfig ? userconfig : null,
            ];
            break;
        case "pnpm" /* EnumPackageManager.pnpm */:
            args = [
                'add',
                ...packages,
                quiet ? '--silent' : null,
                preferOffline ? '--prefer-offline' : null,
                '--ignore-scripts',
                shamefullyHoist ? '--shamefully-hoist' : null,
                userconfig ? '--config' : null,
                userconfig ? userconfig : null,
            ];
            break;
        default:
            /**
             * 對於未知的套件管理器，使用 yarn 的參數格式作為預設
             * For unknown package managers, use yarn's argument format as default
             */
            args = [
                'add',
                ...packages,
                quiet ? '--quiet' : null,
                preferOffline ? '--prefer-offline' : null,
            ];
    }
    /**
     * 過濾掉空值參數
     * Filter out null values
     */
    return args.filter((v) => v != null);
}
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
async function installWithPackageManager(packageManager, packages, argv, runtime) {
    /**
     * 產生安裝參數
     * Generate install arguments
     */
    const args = getInstallArgs(packageManager, {
        package: packages,
        quiet: argv.quiet,
        preferOffline: argv.preferOffline,
        userconfig: argv.userconfig,
        shamefullyHoist: argv.shamefullyHoist,
    });
    /**
     * 執行安裝指令
     * Execute install command
     */
    await (0, cross_spawn_extra_1.async)(packageManager, args, {
        stripAnsi: true,
        cwd: runtime.tmpDir,
        stdio: argv.quiet ? undefined : 'inherit',
        env: process.env,
    });
}
/**
 * 安裝相依套件
 * Install dependencies
 *
 * @param argv - YPX 參數 / YPX arguments
 * @param runtime - 執行時快取 / Runtime cache
 */
async function installDependencies(argv, runtime) {
    let pkgs = argv.package.slice();
    if (!argv.ignoreExisting) {
        pkgs = await bluebird_1.default.resolve(pkgs)
            .filter(async (name) => {
            let r;
            try {
                r = require.resolve(name + '/package.json', {
                    paths: [argv.cwd]
                });
                runtime.skipInstall[name] = r;
                return false;
            }
            catch (e) {
            }
            if (r = await (0, findCommand_1.findCommand)(name, argv.cwd)) {
                runtime.skipInstall[name] = r;
                return false;
            }
            return true;
        });
    }
    if (pkgs.length) {
        if (argv.noInstall) {
            pkgs.forEach(name => runtime.skipInstall[name] = undefined);
        }
        else {
            /**
             * 使用 argv.npmClient 中已檢測到的套件管理器執行安裝
             * Execute installation with package manager from argv.npmClient
             */
            const packageManager = argv.npmClient[0];
            await installWithPackageManager(packageManager, pkgs, argv, runtime);
        }
    }
}
exports.default = installDependencies;
//# sourceMappingURL=installDependencies.js.map