Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YPX = YPX;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _createTemporaryDirectory = _interopRequireDefault(require("./lib/createTemporaryDirectory"));

var _fsExtra = require("fs-extra");

var _findCommand = _interopRequireDefault(require("./lib/findCommand"));

var _initTemporaryPackage = _interopRequireDefault(require("./lib/initTemporaryPackage"));

var _handleOptions = _interopRequireDefault(require("./lib/handleOptions"));

var _handleEnv = _interopRequireDefault(require("./lib/handleEnv"));

var _installDependencies = _interopRequireDefault(require("./lib/installDependencies"));

var _util = require("util");

var _logger = _interopRequireDefault(require("./lib/logger"));

var _binExists = _interopRequireDefault(require("bin-exists"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _err = require("./lib/err");

var _getPkgBin = require("@yarn-tool/get-pkg-bin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function YPX(_argv, inputArgv) {
  var _argv$package;

  let argv = _argv;

  if (!((_argv$package = argv.package) === null || _argv$package === void 0 ? void 0 : _argv$package.length)) {
    throw new Error(`package name is need`);
  }

  argv = await (0, _handleOptions.default)(argv);

  if (argv._.length > 1) {
    throw new Error(`command not invalid, ${argv._}`);
  }

  let runtime = {
    tmpDir: await (0, _createTemporaryDirectory.default)(),
    created: false,
    skipInstall: {},
    console: (0, _logger.default)(argv)
  };
  const consoleShow = (0, _logger.default)({ ...argv,
    quiet: false
  });
  const {
    console
  } = runtime;
  return _bluebird.default.resolve().then(async () => {
    var _argv$_$;

    let label = 'ypx';
    console.time(label);
    console.time(`installed`);
    await (0, _initTemporaryPackage.default)(runtime.tmpDir).tapCatch(e => {
      console.error(`failed create temp package, ${runtime.tmpDir}`);
    });
    await (0, _installDependencies.default)(argv, runtime);

    if (Object.keys(runtime.skipInstall).length) {
      console.info(`skip install`, (0, _util.inspect)(runtime.skipInstall), `or maybe u wanna use --ignore-existing`);
    }

    console.timeEnd(`installed`);
    let command = (_argv$_$ = argv._[0]) !== null && _argv$_$ !== void 0 ? _argv$_$ : argv.package[argv.package.length - 1];
    let cmd_exists;

    if (!(command in runtime.skipInstall)) {
      await (0, _findCommand.default)(command, runtime.tmpDir).catch(err => null).then(bin => {
        if (bin) {
          command = bin;
          cmd_exists = true;
        } else {
          cmd_exists = false;
        }
      });
    }

    if (!cmd_exists) {
      let paths = [runtime.tmpDir, argv.cwd].filter(v => v);
      await _bluebird.default.resolve().then(v => (0, _getPkgBin.defaultPackageBin)({
        name: argv.package[argv.package.length - 1],
        paths: paths.length ? paths : undefined
      }, command)).catch(err => null).then(bin => {
        if (bin) {
          command = bin;
          cmd_exists = true;
        } else {
          cmd_exists = false;
        }
      });
    }

    if (!cmd_exists) {
      await (0, _binExists.default)(command).catch(e => null).then(bool => {
        if (bool) {
          console.warn(`found command '${command}', but it maybe not a module bin`);
        } else {
          console.warn(`command not found: ${command}, maybe will not callable`);
        }
      });
    }

    let env = runtime.env = await (0, _handleEnv.default)(argv, runtime);
    console.time(`exec`);
    console.debug(`[CWD]`, argv.cwd);

    if (argv.userconfig) {
      console.debug(`[RC]`, argv.userconfig);
    }

    console.debug(`[EXEC]`, command, argv['--']);
    let cp = await (0, _crossSpawnExtra.default)(command, argv['--'], {
      stdio: 'inherit',
      env,
      cwd: argv.cwd
    }).catch(e => {
      if (!cmd_exists && e.code === 'ENOENT') {
        consoleShow.magenta.error(`command not found: ${command}`);
        console.timeEnd(`exec`);
        console.timeEnd(label);
        return Promise.reject(new _err.YpxError(1));
      }

      return Promise.reject(e);
    });
    console.timeEnd(`exec`);
    console.time(`remove temp package`);
    await (0, _fsExtra.remove)(runtime.tmpDir);
    console.timeEnd(`remove temp package`);
    console.timeEnd(label);

    if (cp.exitCode) {
      return new _err.YpxError(cp.exitCode);
    }
  }).tapCatch(async () => {
    await (0, _fsExtra.remove)(runtime.tmpDir).catch(err => null);
  }).tap(async () => {
    await (0, _fsExtra.remove)(runtime.tmpDir).catch(err => null);
  });
}

var _default = YPX;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsIl9hcmd2IiwiaW5wdXRBcmd2IiwiYXJndiIsInBhY2thZ2UiLCJsZW5ndGgiLCJFcnJvciIsIl8iLCJydW50aW1lIiwidG1wRGlyIiwiY3JlYXRlZCIsInNraXBJbnN0YWxsIiwiY29uc29sZSIsImNvbnNvbGVTaG93IiwicXVpZXQiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJ0aGVuIiwibGFiZWwiLCJ0aW1lIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJPYmplY3QiLCJrZXlzIiwiaW5mbyIsInRpbWVFbmQiLCJjb21tYW5kIiwiY21kX2V4aXN0cyIsImNhdGNoIiwiZXJyIiwiYmluIiwicGF0aHMiLCJjd2QiLCJmaWx0ZXIiLCJ2IiwibmFtZSIsInVuZGVmaW5lZCIsImJvb2wiLCJ3YXJuIiwiZW52IiwiZGVidWciLCJ1c2VyY29uZmlnIiwiY3AiLCJzdGRpbyIsImNvZGUiLCJtYWdlbnRhIiwiUHJvbWlzZSIsInJlamVjdCIsIllweEVycm9yIiwiZXhpdENvZGUiLCJ0YXAiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sZUFBZUEsR0FBZixDQUFtQkMsS0FBbkIsRUFBOENDLFNBQTlDLEVBQ1A7QUFBQTs7QUFDQyxNQUFJQyxJQUFJLEdBQUdGLEtBQVg7O0FBRUEsTUFBSSxtQkFBQ0UsSUFBSSxDQUFDQyxPQUFOLGtEQUFDLGNBQWNDLE1BQWYsQ0FBSixFQUNBO0FBQ0MsVUFBTSxJQUFJQyxLQUFKLENBQVcsc0JBQVgsQ0FBTjtBQUNBOztBQUVESCxFQUFBQSxJQUFJLEdBQUcsTUFBTSw0QkFBY0EsSUFBZCxDQUFiOztBQUVBLE1BQUlBLElBQUksQ0FBQ0ksQ0FBTCxDQUFPRixNQUFQLEdBQWdCLENBQXBCLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUos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cEMsQ0FBTjtBQUNBLEdBaEpLLENBQVA7QUFrSkE7O2VBRWM5QixHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5cbmltcG9ydCBjcm9zc1NwYXduRXh0cmEgZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSBmcm9tICcuL2xpYi9jcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnknO1xuaW1wb3J0IHsgcmVtb3ZlIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IGZpbmRDb21tYW5kIGZyb20gJy4vbGliL2ZpbmRDb21tYW5kJztcbmltcG9ydCBpbml0VGVtcG9yYXJ5UGFja2FnZSBmcm9tICcuL2xpYi9pbml0VGVtcG9yYXJ5UGFja2FnZSc7XG5pbXBvcnQgeyBJWVBYQXJndW1lbnRzSW5wdXQsIElSdW50aW1lQ2FjaGUsIElZUFhBcmd1bWVudHMgfSBmcm9tICcuL2xpYi90eXBlcyc7XG5pbXBvcnQgaGFuZGxlT3B0aW9ucyBmcm9tICcuL2xpYi9oYW5kbGVPcHRpb25zJztcbmltcG9ydCBoYW5kbGVFbnYgZnJvbSAnLi9saWIvaGFuZGxlRW52JztcbmltcG9ydCBpbnN0YWxsRGVwZW5kZW5jaWVzIGZyb20gJy4vbGliL2luc3RhbGxEZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IG5ld0xvZ2dlciBmcm9tICcuL2xpYi9sb2dnZXInO1xuaW1wb3J0IGJpbkV4aXN0cyBmcm9tICdiaW4tZXhpc3RzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBZcHhFcnJvciB9IGZyb20gJy4vbGliL2Vycic7XG5pbXBvcnQgeyBkZWZhdWx0UGFja2FnZUJpbiB9IGZyb20gJ0B5YXJuLXRvb2wvZ2V0LXBrZy1iaW4nO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gWVBYKF9hcmd2OiBJWVBYQXJndW1lbnRzSW5wdXQsIGlucHV0QXJndj86IHN0cmluZ1tdKVxue1xuXHRsZXQgYXJndiA9IF9hcmd2IGFzIFJlcXVpcmVkPElZUFhBcmd1bWVudHM+O1xuXG5cdGlmICghYXJndi5wYWNrYWdlPy5sZW5ndGgpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHBhY2thZ2UgbmFtZSBpcyBuZWVkYClcblx0fVxuXG5cdGFyZ3YgPSBhd2FpdCBoYW5kbGVPcHRpb25zKGFyZ3YpO1xuXG5cdGlmIChhcmd2Ll8ubGVuZ3RoID4gMSlcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihgY29tbWFuZCBub3QgaW52YWxpZCwgJHthcmd2Ll99YClcblx0fVxuXG5cdGxldCBydW50aW1lOiBJUnVudGltZUNhY2hlID0ge1xuXHRcdHRtcERpcjogYXdhaXQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KCksXG5cdFx0Y3JlYXRlZDogZmFsc2UsXG5cdFx0c2tpcEluc3RhbGw6IHt9LFxuXHRcdGNvbnNvbGU6IG5ld0xvZ2dlcihhcmd2KSxcblx0fTtcblxuXHRjb25zdCBjb25zb2xlU2hvdyA9IG5ld0xvZ2dlcih7XG5cdFx0Li4uYXJndixcblx0XHRxdWlldDogZmFsc2UsXG5cdH0pO1xuXG5cdGNvbnN0IHsgY29uc29sZSB9ID0gcnVudGltZTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0LnRoZW4oYXN5bmMgKCkgPT4ge1xuXHRcdFx0bGV0IGxhYmVsID0gJ3lweCc7XG5cblx0XHRcdGNvbnNvbGUudGltZShsYWJlbCk7XG5cdFx0XHRjb25zb2xlLnRpbWUoYGluc3RhbGxlZGApO1xuXG5cdFx0XHRhd2FpdCBpbml0VGVtcG9yYXJ5UGFja2FnZShydW50aW1lLnRtcERpcilcblx0XHRcdFx0LnRhcENhdGNoKGUgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGZhaWxlZCBjcmVhdGUgdGVtcCBwYWNrYWdlLCAke3J1bnRpbWUudG1wRGlyfWApXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdGF3YWl0IGluc3RhbGxEZXBlbmRlbmNpZXMoYXJndiwgcnVudGltZSk7XG5cblx0XHRcdGlmIChPYmplY3Qua2V5cyhydW50aW1lLnNraXBJbnN0YWxsKS5sZW5ndGgpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhgc2tpcCBpbnN0YWxsYCwgaW5zcGVjdChydW50aW1lLnNraXBJbnN0YWxsKSwgYG9yIG1heWJlIHUgd2FubmEgdXNlIC0taWdub3JlLWV4aXN0aW5nYClcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS50aW1lRW5kKGBpbnN0YWxsZWRgKTtcblxuXHRcdFx0bGV0IGNvbW1hbmQgPSBhcmd2Ll9bMF0gPz8gYXJndi5wYWNrYWdlW2FyZ3YucGFja2FnZS5sZW5ndGggLSAxXTtcblx0XHRcdGxldCBjbWRfZXhpc3RzOiBib29sZWFuO1xuXG5cdFx0XHRpZiAoIShjb21tYW5kIGluIHJ1bnRpbWUuc2tpcEluc3RhbGwpKVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBmaW5kQ29tbWFuZChjb21tYW5kLCBydW50aW1lLnRtcERpcilcblx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IG51bGwpXG5cdFx0XHRcdFx0LnRoZW4oYmluID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmRlYnVnKGNvbW1hbmQsIGA9PmAsIGJpbik7XG5cdFx0XHRcdFx0XHRpZiAoYmluKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb21tYW5kID0gYmluO1xuXHRcdFx0XHRcdFx0XHRjbWRfZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbWRfZXhpc3RzKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcGF0aHMgPSBbXG5cdFx0XHRcdFx0cnVudGltZS50bXBEaXIsXG5cdFx0XHRcdFx0YXJndi5jd2QsXG5cdFx0XHRcdF0uZmlsdGVyKHYgPT4gdik7XG5cblx0XHRcdFx0YXdhaXQgQmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4odiA9PiBkZWZhdWx0UGFja2FnZUJpbih7XG5cdFx0XHRcdFx0XHRuYW1lOiBhcmd2LnBhY2thZ2VbYXJndi5wYWNrYWdlLmxlbmd0aCAtIDFdLFxuXHRcdFx0XHRcdFx0cGF0aHM6IHBhdGhzLmxlbmd0aCA/IHBhdGhzIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdH0sIGNvbW1hbmQpKVxuXHRcdFx0XHRcdC8vLnRhcENhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpXG5cdFx0XHRcdFx0LmNhdGNoKGVyciA9PiBudWxsKVxuXHRcdFx0XHRcdC50aGVuKGJpbiA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5kZWJ1Zyhjb21tYW5kLCBgPT5gLCBiaW4pO1xuXHRcdFx0XHRcdFx0aWYgKGJpbilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZCA9IGJpbjtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNtZF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWNtZF9leGlzdHMpXG5cdFx0XHR7XG5cdFx0XHRcdGF3YWl0IGJpbkV4aXN0cyhjb21tYW5kKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdFx0LnRoZW4oYm9vbCA9PiB7XG5cblx0XHRcdFx0XHRcdGlmIChib29sKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYGZvdW5kIGNvbW1hbmQgJyR7Y29tbWFuZH0nLCBidXQgaXQgbWF5YmUgbm90IGEgbW9kdWxlIGJpbmApXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgY29tbWFuZCBub3QgZm91bmQ6ICR7Y29tbWFuZH0sIG1heWJlIHdpbGwgbm90IGNhbGxhYmxlYClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBlbnYgPSBydW50aW1lLmVudiA9IGF3YWl0IGhhbmRsZUVudihhcmd2LCBydW50aW1lKTtcblxuXHRcdFx0Y29uc29sZS50aW1lKGBleGVjYCk7XG5cblx0XHRcdGNvbnNvbGUuZGVidWcoYFtDV0RdYCwgYXJndi5jd2QpO1xuXHRcdFx0aWYgKGFyZ3YudXNlcmNvbmZpZylcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgW1JDXWAsIGFyZ3YudXNlcmNvbmZpZyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmRlYnVnKGBbRVhFQ11gLCBjb21tYW5kLCBhcmd2WyctLSddKTtcblx0XHRcdGxldCBjcCA9IGF3YWl0IGNyb3NzU3Bhd25FeHRyYShjb21tYW5kLCBhcmd2WyctLSddLCB7XG5cdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdGVudixcblx0XHRcdFx0Y3dkOiBhcmd2LmN3ZCxcblx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0XHRcdGlmICghY21kX2V4aXN0cyAmJiBlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGVTaG93Lm1hZ2VudGEuZXJyb3IoYGNvbW1hbmQgbm90IGZvdW5kOiAke2NvbW1hbmR9YCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLnRpbWVFbmQoYGV4ZWNgKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZChsYWJlbCk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgWXB4RXJyb3IoMSkpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kKGBleGVjYCk7XG5cblx0XHRcdGNvbnNvbGUudGltZShgcmVtb3ZlIHRlbXAgcGFja2FnZWApO1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKTtcblx0XHRcdGNvbnNvbGUudGltZUVuZChgcmVtb3ZlIHRlbXAgcGFja2FnZWApO1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQobGFiZWwpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRpZiAoY3AuZXhpdENvZGUpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIG5ldyBZcHhFcnJvcihjcC5leGl0Q29kZSlcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50YXBDYXRjaChhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCByZW1vdmUocnVudGltZS50bXBEaXIpLmNhdGNoKGVyciA9PiBudWxsKTtcblx0XHR9KVxuXHRcdC50YXAoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKS5jYXRjaChlcnIgPT4gbnVsbCk7XG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBZUFg7XG4iXX0=
