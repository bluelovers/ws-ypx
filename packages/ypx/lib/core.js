"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._processIfNeedInitTmpPkg = _processIfNeedInitTmpPkg;
/**
 * Created by user on 2026/3/4.
 */
const initTemporaryPackage_1 = require("./initTemporaryPackage");
const installDependencies_1 = require("./installDependencies");
const util_1 = require("util");
async function _processIfNeedInitTmpPkg(argv, runtime) {
    const { console } = runtime;
    if (runtime.needInitTmpPkg) {
        console.time(`installed`);
        await (0, initTemporaryPackage_1.initTemporaryPackage)(runtime.tmpDir, argv)
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
        runtime.needInitTmpPkg = false;
    }
}
//# sourceMappingURL=core.js.map