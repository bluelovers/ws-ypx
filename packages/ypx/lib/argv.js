"use strict";
/**
 * Created by user on 2020/1/30.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgv = void 0;
const yargs_1 = __importDefault(require("yargs"));
function parseArgv(inputArgv) {
    return yargs_1.default(inputArgv)
        .parserConfiguration({
        'populate--': true,
    })
        .example(`$0 mocha`, ``)
        .example(`$0 -p esm ts-node mocha -- -r esm`, ``)
        .example(`$0 -q cowsay -- "ynpx"`, ``)
        .option('package', {
        desc: `define the package to be installed`,
        alias: 'p',
        array: true,
        string: true,
    })
        .option('quiet', {
        desc: `Suppressed any output from npx itself (progress bars, error messages, install reports)`,
        alias: 'q',
        boolean: true,
    })
        .option('ignoreExisting', {
        desc: `skip check packages exists or not`,
        boolean: true,
        conflicts: ['noInstall'],
    })
        .option('noInstall', {
        desc: `skip install packages`,
        boolean: true,
    })
        .option('preferOffline', {
        desc: `use network only if dependencies are not available in local cache`,
        boolean: true,
    })
        .option('debugBin', {
        desc: `for cli test only`,
        boolean: true,
    })
        .option('userconfig', {
        desc: `specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)`,
        alias: [
            'useYarnrc',
            'rc',
        ],
        string: true,
        normalize: true,
    })
        .help(`h`)
        .showHelpOnFail(true)
        .argv;
}
exports.parseArgv = parseArgv;
exports.default = parseArgv;
//# sourceMappingURL=argv.js.map