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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsIl9hcmd2IiwiaW5wdXRBcmd2IiwiYXJndiIsInBhY2thZ2UiLCJsZW5ndGgiLCJFcnJvciIsIl8iLCJydW50aW1lIiwidG1wRGlyIiwiY3JlYXRlZCIsInNraXBJbnN0YWxsIiwiY29uc29sZSIsImNvbnNvbGVTaG93IiwicXVpZXQiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJ0aGVuIiwibGFiZWwiLCJ0aW1lIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJPYmplY3QiLCJrZXlzIiwiaW5mbyIsInRpbWVFbmQiLCJjb21tYW5kIiwiY21kX2V4aXN0cyIsImNhdGNoIiwiZXJyIiwiYmluIiwiYm9vbCIsIndhcm4iLCJlbnYiLCJkZWJ1ZyIsImN3ZCIsInVzZXJjb25maWciLCJjcCIsInN0ZGlvIiwiY29kZSIsIm1hZ2VudGEiLCJQcm9taXNlIiwicmVqZWN0IiwiWXB4RXJyb3IiLCJleGl0Q29kZSIsInRhcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxlQUFlQSxHQUFmLENBQW1CQyxLQUFuQixFQUE4Q0MsU0FBOUMsRUFDUDtBQUFBOztBQUNDLE1BQUlDLElBQUksR0FBR0YsS0FBWDs7QUFFQSxNQUFJLG1CQUFDRSxJQUFJLENBQUNDLE9BQU4sa0RBQUMsY0FBY0MsTUFBZixDQUFKLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUosQ0FBVyxzQkFBWCxDQUFOO0FBQ0E7O0FBRURILEVBQUFBLElBQUksR0FBRyxNQUFNLDRCQUFjQSxJQUFkLENBQWI7O0FBRUEsTUFBSUEsSUFBSSxDQUFDSSxDQUFMLENBQU9GLE1BQVAsR0FBZ0IsQ0FBcEIsRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHdCQUF1QkgsSUFBSSxDQUFDSSxDQUFFLEVBQXpDLENBQU47QUFDQTs7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LEVBQ0E7QUFFQyxhQUFPLElBQUlELGFBQUosQ0FBYU4sRUFBRSxDQUFDTyxRQUFoQixDQUFQO0FBQ0E7QUFDRCxHQTdHSyxFQThHTHpCLFFBOUdLLENBOEdJLFlBQVk7QUFDckIsVUFBTSxxQkFBT1osT0FBTyxDQUFDQyxNQUFmLEVBQXVCb0IsS0FBdkIsQ0FBNkJDLEdBQUcsSUFBSSxJQUFwQyxDQUFOO0FBQ0EsR0FoSEssRUFpSExnQixHQWpISyxDQWlIRCxZQUFZO0FBQ2hCLFVBQU0scUJBQU90QyxPQUFPLENBQUNDLE1BQWYsRUFBdUJvQixLQUF2QixDQUE2QkMsR0FBRyxJQUFJLElBQXBDLENBQU47QUFDQSxHQW5ISyxDQUFQO0FBcUhBOztlQUVjOUIsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8yOC5cbiAqL1xuXG5pbXBvcnQgY3Jvc3NTcGF3bkV4dHJhIGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkgZnJvbSAnLi9saWIvY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5JztcbmltcG9ydCB7IHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBmaW5kQ29tbWFuZCBmcm9tICcuL2xpYi9maW5kQ29tbWFuZCc7XG5pbXBvcnQgaW5pdFRlbXBvcmFyeVBhY2thZ2UgZnJvbSAnLi9saWIvaW5pdFRlbXBvcmFyeVBhY2thZ2UnO1xuaW1wb3J0IHsgSVlQWEFyZ3VtZW50c0lucHV0LCBJUnVudGltZUNhY2hlLCBJWVBYQXJndW1lbnRzIH0gZnJvbSAnLi9saWIvdHlwZXMnO1xuaW1wb3J0IGhhbmRsZU9wdGlvbnMgZnJvbSAnLi9saWIvaGFuZGxlT3B0aW9ucyc7XG5pbXBvcnQgaGFuZGxlRW52IGZyb20gJy4vbGliL2hhbmRsZUVudic7XG5pbXBvcnQgaW5zdGFsbERlcGVuZGVuY2llcyBmcm9tICcuL2xpYi9pbnN0YWxsRGVwZW5kZW5jaWVzJztcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJztcbmltcG9ydCBuZXdMb2dnZXIgZnJvbSAnLi9saWIvbG9nZ2VyJztcbmltcG9ydCBiaW5FeGlzdHMgZnJvbSAnYmluLWV4aXN0cyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgWXB4RXJyb3IgfSBmcm9tICcuL2xpYi9lcnInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gWVBYKF9hcmd2OiBJWVBYQXJndW1lbnRzSW5wdXQsIGlucHV0QXJndj86IHN0cmluZ1tdKVxue1xuXHRsZXQgYXJndiA9IF9hcmd2IGFzIFJlcXVpcmVkPElZUFhBcmd1bWVudHM+O1xuXG5cdGlmICghYXJndi5wYWNrYWdlPy5sZW5ndGgpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHBhY2thZ2UgbmFtZSBpcyBuZWVkYClcblx0fVxuXG5cdGFyZ3YgPSBhd2FpdCBoYW5kbGVPcHRpb25zKGFyZ3YpO1xuXG5cdGlmIChhcmd2Ll8ubGVuZ3RoID4gMSlcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihgY29tbWFuZCBub3QgaW52YWxpZCwgJHthcmd2Ll99YClcblx0fVxuXG5cdGxldCBydW50aW1lOiBJUnVudGltZUNhY2hlID0ge1xuXHRcdHRtcERpcjogYXdhaXQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KCksXG5cdFx0Y3JlYXRlZDogZmFsc2UsXG5cdFx0c2tpcEluc3RhbGw6IHt9LFxuXHRcdGNvbnNvbGU6IG5ld0xvZ2dlcihhcmd2KSxcblx0fTtcblxuXHRjb25zdCBjb25zb2xlU2hvdyA9IG5ld0xvZ2dlcih7XG5cdFx0Li4uYXJndixcblx0XHRxdWlldDogZmFsc2UsXG5cdH0pO1xuXG5cdGNvbnN0IHsgY29uc29sZSB9ID0gcnVudGltZTtcblxuXHRyZXR1cm4gQmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0LnRoZW4oYXN5bmMgKCkgPT4ge1xuXHRcdFx0bGV0IGxhYmVsID0gJ3lweCc7XG5cblx0XHRcdGNvbnNvbGUudGltZShsYWJlbCk7XG5cdFx0XHRjb25zb2xlLnRpbWUoYGluc3RhbGxlZGApO1xuXG5cdFx0XHRhd2FpdCBpbml0VGVtcG9yYXJ5UGFja2FnZShydW50aW1lLnRtcERpcilcblx0XHRcdFx0LnRhcENhdGNoKGUgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYGZhaWxlZCBjcmVhdGUgdGVtcCBwYWNrYWdlLCAke3J1bnRpbWUudG1wRGlyfWApXG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdGF3YWl0IGluc3RhbGxEZXBlbmRlbmNpZXMoYXJndiwgcnVudGltZSk7XG5cblx0XHRcdGlmIChPYmplY3Qua2V5cyhydW50aW1lLnNraXBJbnN0YWxsKS5sZW5ndGgpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhgc2tpcCBpbnN0YWxsYCwgaW5zcGVjdChydW50aW1lLnNraXBJbnN0YWxsKSwgYG9yIG1heWJlIHUgd2FubmEgdXNlIC0taWdub3JlLWV4aXN0aW5nYClcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS50aW1lRW5kKGBpbnN0YWxsZWRgKTtcblxuXHRcdFx0bGV0IGNvbW1hbmQgPSBhcmd2Ll9bMF0gPz8gYXJndi5wYWNrYWdlW2FyZ3YucGFja2FnZS5sZW5ndGggLSAxXTtcblx0XHRcdGxldCBjbWRfZXhpc3RzOiBib29sZWFuO1xuXG5cdFx0XHRpZiAoIShjb21tYW5kIGluIHJ1bnRpbWUuc2tpcEluc3RhbGwpKVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBmaW5kQ29tbWFuZChjb21tYW5kLCBydW50aW1lLnRtcERpcilcblx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IG51bGwpXG5cdFx0XHRcdFx0LnRoZW4oYmluID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmRlYnVnKGNvbW1hbmQsIGA9PmAsIGJpbik7XG5cdFx0XHRcdFx0XHRpZiAoYmluKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb21tYW5kID0gYmluO1xuXHRcdFx0XHRcdFx0XHRjbWRfZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbWRfZXhpc3RzKVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBiaW5FeGlzdHMoY29tbWFuZClcblx0XHRcdFx0XHQuY2F0Y2goZSA9PiBudWxsKVxuXHRcdFx0XHRcdC50aGVuKGJvb2wgPT4ge1xuXG5cdFx0XHRcdFx0XHRpZiAoYm9vbClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBmb3VuZCBjb21tYW5kICcke2NvbW1hbmR9JywgYnV0IGl0IG1heWJlIG5vdCBhIG1vZHVsZSBiaW5gKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYGNvbW1hbmQgbm90IGZvdW5kOiAke2NvbW1hbmR9LCBtYXliZSB3aWxsIG5vdCBjYWxsYWJsZWApXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0O1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgZW52ID0gcnVudGltZS5lbnYgPSBhd2FpdCBoYW5kbGVFbnYoYXJndiwgcnVudGltZSk7XG5cblx0XHRcdGNvbnNvbGUudGltZShgZXhlY2ApO1xuXG5cdFx0XHRjb25zb2xlLmRlYnVnKGBbQ1dEXWAsIGFyZ3YuY3dkKTtcblx0XHRcdGlmIChhcmd2LnVzZXJjb25maWcpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYFtSQ11gLCBhcmd2LnVzZXJjb25maWcpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5kZWJ1ZyhgW0VYRUNdYCwgY29tbWFuZCwgYXJndlsnLS0nXSk7XG5cdFx0XHRsZXQgY3AgPSBhd2FpdCBjcm9zc1NwYXduRXh0cmEoY29tbWFuZCwgYXJndlsnLS0nXSwge1xuXHRcdFx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdFx0XHRlbnYsXG5cdFx0XHRcdGN3ZDogYXJndi5jd2QsXG5cdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZSA9PiB7XG5cblx0XHRcdFx0XHRpZiAoIWNtZF9leGlzdHMgJiYgZS5jb2RlID09PSAnRU5PRU5UJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zb2xlU2hvdy5tYWdlbnRhLmVycm9yKGBjb21tYW5kIG5vdCBmb3VuZDogJHtjb21tYW5kfWApO1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmVycm9yKGUpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS50aW1lRW5kKGBleGVjYCk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLnRpbWVFbmQobGFiZWwpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFlweEVycm9yKDEpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cblx0XHRcdGNvbnNvbGUudGltZUVuZChgZXhlY2ApO1xuXG5cdFx0XHRjb25zb2xlLnRpbWUoYHJlbW92ZSB0ZW1wIHBhY2thZ2VgKTtcblx0XHRcdGF3YWl0IHJlbW92ZShydW50aW1lLnRtcERpcik7XG5cdFx0XHRjb25zb2xlLnRpbWVFbmQoYHJlbW92ZSB0ZW1wIHBhY2thZ2VgKTtcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kKGxhYmVsKTtcblxuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0aWYgKGNwLmV4aXRDb2RlKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdHJldHVybiBuZXcgWXB4RXJyb3IoY3AuZXhpdENvZGUpXG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGFwQ2F0Y2goYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKS5jYXRjaChlcnIgPT4gbnVsbCk7XG5cdFx0fSlcblx0XHQudGFwKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHJlbW92ZShydW50aW1lLnRtcERpcikuY2F0Y2goZXJyID0+IG51bGwpO1xuXHRcdH0pXG5cdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgWVBYO1xuIl19
