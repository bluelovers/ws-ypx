"use strict";
/**
 * Created by user on 2020/7/18.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgvCore = exports.parseArgv = void 0;
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
function parseArgv(inputArgv) {
    let yg = parseArgvCore(inputArgv);
    let argv = yg.parseSync();
    let bool = true;
    if (argv._.length) {
        let found = -1;
        for (let i = 0; i < inputArgv.length; i++) {
            if ([
                '--package',
                '-p',
                '--userconfig',
                '--useYarnrc',
                '--rc',
                '--cwd',
            ].includes(inputArgv[i - 1])) {
                continue;
            }
            if (inputArgv[i] === argv._[0]) {
                let ls = inputArgv.slice(i, i + 1);
                if (ls.every((value, index) => value === argv._[index])) {
                    found = i + 1;
                    break;
                }
            }
        }
        if (found !== -1) {
            bool = false;
            yg = parseArgvCore(inputArgv.slice(0, found));
            // @ts-ignore
            argv = yg
                .help(`h`)
                .showHelpOnFail(true)
                .argv;
            argv['--'] = inputArgv.slice(found);
            if (argv['--'][0] === '--') {
                argv['--'].shift();
            }
        }
    }
    if (typeof argv.package === 'string') {
        argv.package = [argv.package];
    }
    if (bool) {
        yg
            .help(`h`)
            .showHelpOnFail(true)
            .argv;
    }
    return argv;
}
exports.parseArgv = parseArgv;
function parseArgvCore(inputArgv) {
    const y = (0, yargs_1.default)(inputArgv)
        .parserConfiguration({
        'populate--': true,
    })
        .example(`$0 mocha`, ``)
        .example(`$0 -p esm -p ts-node -p mocha -- -r esm`, ``)
        .example(`$0 -q cowsay -- "ynpx"`, ``)
        .option('package', {
        desc: `define the package to be installed`,
        alias: 'p',
        //array: true,
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
        .option('debugMode', {
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
    });
    return y;
}
exports.parseArgvCore = parseArgvCore;
exports.default = parseArgv;
//# sourceMappingURL=index.js.map