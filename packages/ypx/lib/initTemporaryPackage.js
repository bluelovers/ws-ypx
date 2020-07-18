"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTemporaryPackage = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const initConfig_1 = __importDefault(require("./initConfig"));
function initTemporaryPackage(tmpDir) {
    let data = initConfig_1.default();
    return bluebird_1.default.all([
        fs_extra_1.writeFile(path_1.join(tmpDir, '.yarnrc'), data.rc),
        fs_extra_1.writeFile(path_1.join(tmpDir, '.yarnrc.yml'), data.yml),
        fs_extra_1.writeFile(path_1.join(tmpDir, 'yarn.lock'), ``),
        fs_extra_1.writeJSON(path_1.join(tmpDir, 'package.json'), {
            "license": "ISC",
        }),
    ]);
}
exports.initTemporaryPackage = initTemporaryPackage;
exports.default = initTemporaryPackage;
//# sourceMappingURL=initTemporaryPackage.js.map