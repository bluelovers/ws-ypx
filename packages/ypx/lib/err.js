"use strict";
/**
 * Created by user on 2020/1/30.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YpxError = void 0;
class YpxError extends Error {
    constructor(exitCode) {
        super(String(exitCode));
        this.exitCode = exitCode;
    }
}
exports.YpxError = YpxError;
//# sourceMappingURL=err.js.map