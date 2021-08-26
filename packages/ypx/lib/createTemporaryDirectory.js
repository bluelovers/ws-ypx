"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTemporary = exports.createTemporaryDirectory = exports.getCacheDir = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/1/28.
 */
const tmp_1 = require("tmp");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const path_1 = require("path");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const fs_extra_1 = require("fs-extra");
function getCacheDir() {
    try {
        let cp = (0, cross_spawn_extra_1.sync)('yarn', [
            'config',
            'current',
            '--json',
        ], {
            stripAnsi: true,
            env: process.env,
        });
        let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);
        if (data.tempFolder) {
            return data.tempFolder;
        }
    }
    catch (e) {
    }
    if (process.env.YARN_CACHE_FOLDER && (0, fs_extra_1.pathExistsSync)(process.env.YARN_CACHE_FOLDER)) {
        return (0, path_1.join)(process.env.YARN_CACHE_FOLDER, '_ypx');
    }
}
exports.getCacheDir = getCacheDir;
function createTemporaryDirectory() {
    return new bluebird_1.default((resolve, reject) => {
        const tmpdir = getCacheDir();
        (0, tmp_1.dir)({
            unsafeCleanup: false,
            prefix: 'ypx_',
            dir: tmpdir,
            // @ts-ignore
            tmpdir,
        }, (error, dirPath) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(dirPath);
            }
        });
    });
}
exports.createTemporaryDirectory = createTemporaryDirectory;
async function newTemporary() {
    let tmpDir = await createTemporaryDirectory();
    return {
        get tmpDir() {
            return tmpDir;
        },
        remove() {
            return (0, fs_extra_1.remove)(tmpDir);
        }
    };
}
exports.newTemporary = newTemporary;
exports.default = createTemporaryDirectory;
//# sourceMappingURL=createTemporaryDirectory.js.map