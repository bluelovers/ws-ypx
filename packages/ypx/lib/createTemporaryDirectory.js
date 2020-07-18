"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTemporary = exports.createTemporaryDirectory = exports.getCacheDir = void 0;
/**
 * Created by user on 2020/1/28.
 */
const tmp_1 = require("tmp");
const bluebird_1 = __importDefault(require("bluebird"));
const path_1 = require("path");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const fs_extra_1 = require("fs-extra");
function getCacheDir() {
    try {
        let cp = cross_spawn_extra_1.sync('yarn', [
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
    if (process.env.YARN_CACHE_FOLDER && fs_extra_1.pathExistsSync(process.env.YARN_CACHE_FOLDER)) {
        return path_1.join(process.env.YARN_CACHE_FOLDER, '_ypx');
    }
}
exports.getCacheDir = getCacheDir;
function createTemporaryDirectory() {
    return new bluebird_1.default((resolve, reject) => {
        const tmpdir = getCacheDir();
        tmp_1.dir({
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
            return fs_extra_1.remove(tmpDir);
        }
    };
}
exports.newTemporary = newTemporary;
exports.default = createTemporaryDirectory;
//# sourceMappingURL=createTemporaryDirectory.js.map