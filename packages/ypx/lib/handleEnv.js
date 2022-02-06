"use strict";
/**
 * Created by user on 2020/1/29.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEnv = void 0;
const env_path_1 = require("@yarn-tool/env-path");
function handleEnv(argv, runtime, _env) {
    let paths = (0, env_path_1.envObject)(_env || runtime.env || process.env)
        .path.append([runtime.tmpDir]);
    let env = paths.get.env();
    // @ts-ignore
    env.path = env.Path = env.PATH = paths.path.get.string();
    return env;
}
exports.handleEnv = handleEnv;
exports.default = handleEnv;
//# sourceMappingURL=handleEnv.js.map