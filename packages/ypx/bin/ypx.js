#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("v8-compile-cache");
const index_1 = require("../index");
const util_1 = require("util");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const update_notifier_1 = require("@yarn-tool/update-notifier");
const err_1 = require("../lib/err");
const ynpx_argv_1 = require("@ynpx/ynpx-argv");
let inputArgv = process.argv.slice(2);
(0, update_notifier_1.updateNotifier)([__dirname, '..']);
let argv = (0, ynpx_argv_1.parseArgv)(inputArgv);
if (argv.debugBin) {
    console.log(__filename);
    process.exit();
}
let { p = [] } = argv;
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
bluebird_1.default.resolve()
    .then(() => (0, index_1.YPX)({
    ...argv,
    package: p,
}, inputArgv))
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