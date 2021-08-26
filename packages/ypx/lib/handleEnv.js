"use strict";
/**
 * Created by user on 2020/1/29.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEnv = void 0;
const path_env_1 = require("path-env");
function handleEnv(argv, runtime, _env) {
    let paths = (0, path_env_1.pathEnv)(_env || runtime.env || process.env)
        .path.append([runtime.tmpDir]);
    let env = paths.get.env();
    // @ts-ignore
    env.path = env.Path = env.PATH = paths.path.get.string();
    return env;
}
exports.handleEnv = handleEnv;
exports.default = handleEnv;
//# sourceMappingURL=handleEnv.js.map