"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTemporaryPackage = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const initConfig_1 = require("./initConfig");
function initTemporaryPackage(tmpDir) {
    let data = (0, initConfig_1.buildConfig)();
    return bluebird_1.default.all([
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, '.yarnrc'), data.rc),
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, '.yarnrc.yml'), data.yml),
        (0, fs_extra_1.writeFile)((0, path_1.join)(tmpDir, 'yarn.lock'), ``),
        (0, fs_extra_1.writeJSON)((0, path_1.join)(tmpDir, 'package.json'), {
            "license": "ISC",
        }),
    ]);
}
exports.initTemporaryPackage = initTemporaryPackage;
exports.default = initTemporaryPackage;
//# sourceMappingURL=initTemporaryPackage.js.map