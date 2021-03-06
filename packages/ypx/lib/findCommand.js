"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand2 = exports.findCommand = void 0;
const cross_spawn_extra_1 = __importDefault(require("cross-spawn-extra"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
async function findCommand(name, cwd) {
    let cp = await cross_spawn_extra_1.default.sync('yarn', [
        'bin',
        name,
    ].filter(v => v != null), {
        stripAnsi: true,
        cwd,
        env: process.env,
    });
    let bin = cp.stdout.toString()
        .replace(/^\s+|\s+$/g, '');
    if (bin && fs_extra_1.pathExistsSync(bin)) {
        return bin;
    }
}
exports.findCommand = findCommand;
async function findCommand2(name, cwd) {
    try {
        let file = require.resolve(name + '/package.json', {
            paths: [cwd]
        });
        let json = await fs_extra_1.readJSON(file);
        let dir = path_1.dirname(file);
        if (json.bin) {
            let bin;
            if (typeof json.bin === 'string') {
                bin = json.bin;
            }
            else {
                bin = Object.values(json.bin)[0];
            }
        }
    }
    catch (e) {
    }
}
exports.findCommand2 = findCommand2;
exports.default = findCommand;
//# sourceMappingURL=findCommand.js.map