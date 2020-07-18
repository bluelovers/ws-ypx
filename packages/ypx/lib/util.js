"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossSpawnOutput = exports.stripAnsi = void 0;
/**
 * Created by user on 2020/1/30.
 */
const core_1 = require("cross-spawn-extra/core");
const crlf_normalize_1 = require("crlf-normalize");
exports.stripAnsi = core_1.CrossSpawnExtra.stripAnsi;
function crossSpawnOutput(buf, options = {
    clearEol: true,
}) {
    let output = '';
    if (!Buffer.isBuffer(buf) && Array.isArray(buf)) {
        output = buf
            .filter(function (b) {
            return !(!b || !b.length);
        })
            .map(function (b) {
            return b.toString();
        })
            .join("\n");
    }
    else {
        output = (buf || '').toString();
    }
    if (options.stripAnsi) {
        output = exports.stripAnsi(output);
    }
    output = crlf_normalize_1.crlf(output);
    if (options.clearEol || options.clearEol == null) {
        output = output.replace(/\n+$/g, '');
    }
    return output;
}
exports.crossSpawnOutput = crossSpawnOutput;
//# sourceMappingURL=util.js.map