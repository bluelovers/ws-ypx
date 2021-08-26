"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = void 0;
const lodash_1 = require("lodash");
const path_1 = require("path");
function handleOptions(argv) {
    let result = (0, lodash_1.defaultsDeep)((0, lodash_1.cloneDeep)(argv), {
        package: [],
        _: [],
        "--": [],
        quiet: false,
        preferOffline: false,
        ignoreExisting: false,
        noInstall: false,
        cwd: argv.cwd ? argv.cwd : process.cwd(),
    });
    if (result.userconfig) {
        result.userconfig = (0, path_1.resolve)(result.cwd, result.userconfig);
    }
    return result;
}
exports.handleOptions = handleOptions;
exports.default = handleOptions;
//# sourceMappingURL=handleOptions.js.map