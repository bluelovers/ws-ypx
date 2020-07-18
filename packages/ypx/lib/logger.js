"use strict";
/**
 * Created by user on 2020/1/29.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLogger = void 0;
const debug_color2_1 = require("debug-color2");
function newLogger(argv) {
    let console = new debug_color2_1.Console2(null, {
        label: true,
        time: true,
    });
    console.enabled = !argv.quiet;
    return console;
}
exports.newLogger = newLogger;
exports.default = newLogger;
//# sourceMappingURL=logger.js.map