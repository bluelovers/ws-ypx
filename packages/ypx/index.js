"use strict";
/**
 * Created by user on 2020/1/28.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YPX = void 0;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const createTemporaryDirectory_1 = require("./lib/createTemporaryDirectory");
const fs_extra_1 = require("fs-extra");
const findCommand_1 = require("./lib/findCommand");
const initTemporaryPackage_1 = require("./lib/initTemporaryPackage");
const handleOptions_1 = require("./lib/handleOptions");
const handleEnv_1 = require("./lib/handleEnv");
const installDependencies_1 = require("./lib/installDependencies");
const util_1 = require("util");
const logger_1 = require("./lib/logger");
const bin_exists_1 = (0, tslib_1.__importDefault)(require("bin-exists"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const err_1 = require("./lib/err");
const get_pkg_bin_1 = require("@yarn-tool/get-pkg-bin");
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
        console.time(`installed`);
        await (0, initTemporaryPackage_1.initTemporaryPackage)(runtime.tmpDir)
            .tapCatch(e => {
            console.error(`failed create temp package, ${runtime.tmpDir}`);
        })
            .tap(() => {
            console.debug(`[temp package]`, runtime.tmpDir);
        });
        await (0, installDependencies_1.installDependencies)(argv, runtime);
        if (Object.keys(runtime.skipInstall).length) {
            console.info(`skip install`, (0, util_1.inspect)(runtime.skipInstall), `or maybe u wanna use --ignore-existing`);
        }
        console.timeEnd(`installed`);
        console.debug(`[temp package]`, runtime.tmpDir);
        // @ts-ignore
        let command = (_a = argv._[0]) !== null && _a !== void 0 ? _a : argv.package[argv.package.length - 1];
        let cmd_exists;
        if (/^[^@]+@.+/.test(command)) {
            command = command
                .replace(/^([^@]+)@.+$/, '$1');
            delete runtime.skipInstall[command];
        }
        if (!(command in runtime.skipInstall)) {
            await (0, findCommand_1.findCommand)(command, runtime.tmpDir)
                .catch(err => null)
                .then(bin => {
                //console.debug(command, `=>`, bin);
                if (bin) {
                    command = bin;
                    cmd_exists = true;
                }
                else {
                    cmd_exists = false;
                    console.debug(`can't find command by 'yarn bin ${command}'`);
                }
            });
        }
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
                .catch(err => null)
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
                .catch(e => null)
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
        await removeTmpDir().catch(err => null);
    })
        .tap(async () => {
        await removeTmpDir().catch(err => null);
    });
    async function removeTmpDir() {
        if (!argv.debugMode) {
            return (0, fs_extra_1.remove)(runtime.tmpDir);
        }
    }
}
exports.YPX = YPX;
exports.default = YPX;
//# sourceMappingURL=index.js.map