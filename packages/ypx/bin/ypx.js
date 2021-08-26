#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = (0, tslib_1.__importDefault)(require("../index"));
const util_1 = require("util");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const update_notifier_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/update-notifier"));
const err_1 = require("../lib/err");
const ynpx_argv_1 = (0, tslib_1.__importDefault)(require("@ynpx/ynpx-argv"));
let inputArgv = process.argv.slice(2);
(0, update_notifier_1.default)([__dirname, '..']);
let argv = (0, ynpx_argv_1.default)(inputArgv);
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
    .then(() => (0, index_1.default)({
    ...argv,
    package: p,
}, inputArgv))
    .catch(err_1.YpxError, (e) => {
    process.exit(e.exitCode);
})
    .tap((e) => {
    if (e && e instanceof err_1.YpxError) {
        process.exit(e.exitCode);
    }
});
//# sourceMappingURL=ypx.js.map