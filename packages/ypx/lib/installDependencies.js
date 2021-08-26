"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = void 0;
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const findCommand_1 = require("./findCommand");
async function installDependencies(argv, runtime) {
    let pkgs = argv.package.slice();
    if (!argv.ignoreExisting) {
        pkgs = await bluebird_1.default.resolve(pkgs)
            .filter(async (name) => {
            let r;
            try {
                r = require.resolve(name + '/package.json', {
                    paths: [argv.cwd]
                });
                runtime.skipInstall[name] = r;
                return false;
            }
            catch (e) {
            }
            if (r = await (0, findCommand_1.findCommand)(name, argv.cwd)) {
                runtime.skipInstall[name] = r;
                return false;
            }
            return true;
        });
    }
    if (pkgs.length) {
        if (argv.noInstall) {
            pkgs.forEach(name => runtime.skipInstall[name] = undefined);
        }
        else {
            await (0, cross_spawn_extra_1.async)('yarn', [
                'add',
                ...pkgs,
                (argv.quiet ? '--quiet' : null),
                (argv.preferOffline ? '--prefer-offline' : null),
                '--link-duplicates',
                '--no-node-version-check',
                '--ignore-optional',
                (argv.userconfig ? '--use-yarnrc' : null),
                (argv.userconfig ? argv.userconfig : null),
            ].filter(v => v != null), {
                stripAnsi: true,
                cwd: runtime.tmpDir,
                stdio: argv.quiet ? undefined : 'inherit',
                env: process.env,
            });
        }
    }
}
exports.installDependencies = installDependencies;
exports.default = installDependencies;
//# sourceMappingURL=installDependencies.js.map