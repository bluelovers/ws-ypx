"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = exports.defaultConfig = void 0;
/**
 * Created by user on 2020/1/30.
 */
const lodash_1 = require("lodash");
const camel_case_1 = require("camel-case");
function defaultConfig() {
    return {
        'enableGlobalCache': true,
        'disable-self-update-check': true,
        'prefer-offline': true,
        'emoji': true,
    };
}
exports.defaultConfig = defaultConfig;
function buildConfig(userconfig = {}) {
    userconfig = (0, lodash_1.defaultsDeep)(userconfig, defaultConfig());
    let o = Object.entries(userconfig)
        .reduce((a, [k, v]) => {
        let ck = (0, camel_case_1.camelCase)(k);
        a.rc.push(`${k} ${v}`);
        a.rc.push(`${ck} ${v}`);
        a.yml.push(`${ck}: ${v}`);
        return a;
    }, {
        rc: [],
        yml: [],
    });
    return {
        rc: o.rc.join('\n') + '\n',
        yml: o.yml.join('\n') + '\n',
    };
}
exports.buildConfig = buildConfig;
exports.default = buildConfig;
//# sourceMappingURL=initConfig.js.map