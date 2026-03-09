"use strict";
/**
 * Created by user on 2020/1/28.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YPX = YPX;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const createTemporaryDirectory_1 = require("./lib/createTemporaryDirectory");
const fs_extra_1 = require("fs-extra");
const findCommand_1 = require("./lib/findCommand");
const handleOptions_1 = require("./lib/handleOptions");
const handleEnv_1 = require("./lib/handleEnv");
const logger_1 = require("./lib/logger");
const bin_exists_1 = tslib_1.__importDefault(require("bin-exists"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const err_1 = require("./lib/err");
const get_pkg_bin_1 = require("@yarn-tool/get-pkg-bin");
const require_resolve_1 = require("@yarn-tool/require-resolve");
const core_1 = require("./lib/core");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const detect_1 = require("@yarn-tool/npm-package-arg-util/lib/detect");
const npa_to_deps_1 = require("@yarn-tool/npa-to-deps");
const detect_package_manager_1 = require("@yarn-tool/detect-package-manager");
async function YPX(_argv, inputArgv) {
    var _a;
    let argv = _argv;
    if (!((_a = argv.package) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error(`package name is needed`);
    }
    argv = await (0, handleOptions_1.handleOptions)(argv);
    if (argv._.length > 1) {
        throw new Error(`command not invalid, ${argv._}`);
    }
    let runtime = {
        tmpDir: await (0, createTemporaryDirectory_1.createTemporaryDirectory)(),
        created: false,
        skipInstall: {},
        console: (0, logger_1.newLogger)(argv),
        needInitTmpPkg: true,
        npmClient: null,
    };
    const consoleShow = (0, logger_1.newLogger)({
        ...argv,
        quiet: false,
    });
    const { console } = runtime;
    return bluebird_1.default.resolve()
        .then(async () => {
        var _a;
        let label = 'ypx';
        console.time(label);
        /**
         * 檢測要使用的套件管理器並更新 argv.npmClient
         * Detect package manager and update argv.npmClient
         */
        const npmClient = await (0, detect_package_manager_1.whichPackageManagerAsync)(argv.npmClient, true);
        if (!npmClient) {
            throw new Error(`no package manager found`);
        }
        argv.npmClient = [runtime.npmClient = npmClient];
        console.debug(`[npmClient]`, runtime.npmClient);
        console.debug(`[ignoreExisting]`, argv.ignoreExisting);
        console.debug(`[preferOffline]`, argv.preferOffline);
        if (argv.package.length !== 1 || argv.ignoreExisting) {
            await (0, core_1._processIfNeedInitTmpPkg)(argv, runtime);
        }
        else {
            runtime.needInitTmpPkg = null;
        }
        // console.debug(`[temp package]`, runtime.tmpDir);
        const packageFirst = argv.package[0];
        const packageLatest = argv.package[argv.package.length - 1];
        const package_command = argv._[0];
        // @ts-ignore
        let command = package_command !== null && package_command !== void 0 ? package_command : packageLatest;
        let cmd_exists;
        let npa = (0, npm_package_arg_util_1.npaTry2)(packageLatest, {
            shouldHasName: true,
        });
        console.dir({
            command,
            package_command,
            packageFirst,
            packageLatest,
            package: argv.package,
            _: argv._,
            npa,
        });
        if (npa) {
            console.dir((0, npa_to_deps_1.npaResultToDepsValue)(npa));
            if (!(0, detect_1.isNameSameAsRaw)(npa)) {
                runtime.needInitTmpPkg = true;
                if (!argv.ignoreExisting) {
                    console.warn('由於偵測到套件指令包含版本要求，已強制啟用 --ignore-existing 設定');
                    argv.ignoreExisting = true;
                }
            }
        }
        if (/^[^@]+@.+/.test(command)) {
            command = command
                .replace(/^([^@]+)@.+$/, '$1');
            delete runtime.skipInstall[command];
        }
        if (!argv.ignoreExisting && !(command in runtime.skipInstall)) {
            /**
             * 嘗試使用 resolvePackage + defaultPackageBin 搜尋 command
             * Try to find command using resolvePackage + defaultPackageBin
             */
            await bluebird_1.default.resolve()
                .then(() => {
                const pkgInfo = (0, require_resolve_1.resolvePackage)(command, {
                    includeGlobal: true,
                    cwd: runtime.needInitTmpPkg === false ? argv.cwd : runtime.tmpDir,
                });
                // console.dir(pkgInfo);
                console.debug(`detect a package ${pkgInfo.name}@${pkgInfo.pkg.version}`);
                console.dir({
                    pkgRoot: pkgInfo.pkgRoot,
                    bin: pkgInfo.pkg.bin,
                    exports: pkgInfo.pkg.exports,
                });
                /**
                 * 若找到套件資訊，使用 defaultPackageBin 取得 bin 路徑
                 * If package info found, use defaultPackageBin to get bin path
                 */
                let bin = (0, get_pkg_bin_1.defaultPackageBin)(pkgInfo, command);
                if (bin) {
                    command = bin;
                    cmd_exists = true;
                    console.debug(`found command: ${command}`);
                    runtime.needInitTmpPkg = false;
                }
                return bin;
            })
                .catch(e => {
                return null;
            })
                .then(async (result) => {
                var _a;
                /**
                 * 若上述方法未找到，使用 findCommand 作為後備
                 * If above methods didn't find, use findCommand as fallback
                 */
                if (!cmd_exists) {
                    console.log(66666);
                    (_a = runtime.needInitTmpPkg) !== null && _a !== void 0 ? _a : (runtime.needInitTmpPkg = true);
                    await (0, core_1._processIfNeedInitTmpPkg)(argv, runtime);
                    return (0, findCommand_1.findCommand)(command, runtime.tmpDir)
                        .catch(e => {
                        return null;
                    })
                        .then(bin2 => {
                        if (bin2) {
                            command = bin2;
                            cmd_exists = true;
                        }
                        else {
                            cmd_exists = false;
                            console.debug(`can't find command by 'yarn bin ${command}'`);
                        }
                        return bin2;
                    });
                }
                return result;
            });
        }
        else {
            (_a = runtime.needInitTmpPkg) !== null && _a !== void 0 ? _a : (runtime.needInitTmpPkg = true);
        }
        console.log(77777);
        await (0, core_1._processIfNeedInitTmpPkg)(argv, runtime);
        if (!cmd_exists) {
            let paths = [
                runtime.tmpDir,
                argv.cwd,
            ].filter(v => v);
            await bluebird_1.default.resolve()
                .then(v => (0, get_pkg_bin_1.defaultPackageBin)({
                name: argv.package[argv.package.length - 1],
                paths: paths.length ? paths : undefined,
            }, command))
                //.tapCatch(err => console.error(err))
                .catch(e => {
                return null;
            })
                .then(bin => {
                //console.debug(command, `=>`, bin);
                if (bin) {
                    command = bin;
                    cmd_exists = true;
                }
                else {
                    cmd_exists = false;
                    console.debug(`can't find default package bin of ${command}`);
                }
            });
        }
        if (!cmd_exists) {
            await (0, bin_exists_1.default)(command)
                .catch(e => {
                return null;
            })
                .then(bool => {
                if (bool) {
                    console.warn(`found command '${command}', might not be a module bin`);
                }
                else {
                    console.warn(`command not found: ${command}, might not be callable`);
                }
            });
        }
        let env = runtime.env = await (0, handleEnv_1.handleEnv)(argv, runtime);
        console.time(`exec`);
        console.debug(`[CWD]`, argv.cwd);
        if (argv.userconfig) {
            console.debug(`[RC]`, argv.userconfig);
        }
        console.debug(`[EXEC]`, command, argv['--']);
        let cp = await (0, cross_spawn_extra_1.async)(command, argv['--'], {
            stdio: 'inherit',
            env,
            cwd: argv.cwd,
        })
            .catch(e => {
            if (!cmd_exists && e.code === 'ENOENT') {
                consoleShow.magenta.error(`command not found: ${command}`);
                //console.error(e);
                console.timeEnd(`exec`);
                console.timeEnd(label);
                return Promise.reject(new err_1.YpxError(1));
            }
            return Promise.reject(e);
        });
        console.timeEnd(`exec`);
        if (!argv.debugMode) {
            console.time(`remove temp package`);
            await removeTmpDir();
            console.timeEnd(`remove temp package`);
        }
        console.timeEnd(label);
        // @ts-ignore
        if (cp.exitCode) {
            // @ts-ignore
            return new err_1.YpxError(cp.exitCode);
        }
    })
        .tapCatch(async () => {
        return removeTmpDir().catch(e => {
            return null;
        });
    })
        .tap(async () => {
        return removeTmpDir().catch(e => {
            return null;
        });
    });
    async function removeTmpDir() {
        if (!argv.debugMode) {
            return (0, fs_extra_1.remove)(runtime.tmpDir);
        }
    }
}
exports.default = YPX;
//# sourceMappingURL=index.js.map