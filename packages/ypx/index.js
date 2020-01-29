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
    await (0, _crossSpawnExtra.default)(command, argv['--'], {
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
  }).tapCatch(async () => {
    await (0, _fsExtra.remove)(runtime.tmpDir).catch(err => null);
  }).tap(async () => {
    await (0, _fsExtra.remove)(runtime.tmpDir).catch(err => null);
  });
}

var _default = YPX;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsIl9hcmd2IiwiaW5wdXRBcmd2IiwiYXJndiIsInBhY2thZ2UiLCJsZW5ndGgiLCJFcnJvciIsIl8iLCJydW50aW1lIiwidG1wRGlyIiwiY3JlYXRlZCIsInNraXBJbnN0YWxsIiwiY29uc29sZSIsImNvbnNvbGVTaG93IiwicXVpZXQiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJ0aGVuIiwibGFiZWwiLCJ0aW1lIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJPYmplY3QiLCJrZXlzIiwiaW5mbyIsInRpbWVFbmQiLCJjb21tYW5kIiwiY21kX2V4aXN0cyIsImNhdGNoIiwiZXJyIiwiYmluIiwiYm9vbCIsIndhcm4iLCJlbnYiLCJkZWJ1ZyIsImN3ZCIsInVzZXJjb25maWciLCJzdGRpbyIsImNvZGUiLCJtYWdlbnRhIiwiUHJvbWlzZSIsInJlamVjdCIsIllweEVycm9yIiwidGFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVPLGVBQWVBLEdBQWYsQ0FBbUJDLEtBQW5CLEVBQThDQyxTQUE5QyxFQUNQO0FBQUE7O0FBQ0MsTUFBSUMsSUFBSSxHQUFHRixLQUFYOztBQUVBLE1BQUksbUJBQUNFLElBQUksQ0FBQ0MsT0FBTixrREFBQyxjQUFjQyxNQUFmLENBQUosRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHNCQUFYLENBQU47QUFDQTs7QUFFREgsRUFBQUEsSUFBSSxHQUFHLE1BQU0sNEJBQWNBLElBQWQsQ0FBYjs7QUFFQSxNQUFJQSxJQUFJLENBQUNJLENBQUwsQ0FBT0YsTUFBUCxHQUFnQixDQUFwQixFQUNBO0FBQ0MsVUFBTSxJQUFJQyxLQUFKLENBQVcsd0JBQXVCSCxJQUFJLENBQUNJLENBQUUsRUFBekMsQ0FBTjtBQUNBOztBQUVELE1BQUlDLE9BQXNC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QUNDLE1BQWYsRUFBdUJvQixLQUF2QixDQUE2QkMsR0FBRyxJQUFJLElBQXBDLENBQU47QUFDQSxHQTNHSyxFQTRHTGMsR0E1R0ssQ0E0R0QsWUFBWTtBQUNoQixVQUFNLHFCQUFPcEMsT0FBTyxDQUFDQyxNQUFmLEVBQXVCb0IsS0FBdkIsQ0FBNkJDLEdBQUcsSUFBSSxJQUFwQyxDQUFOO0FBQ0EsR0E5R0ssQ0FBUDtBQWdIQTs7ZUFFYzlCLEciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMjguXG4gKi9cblxuaW1wb3J0IGNyb3NzU3Bhd25FeHRyYSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5IGZyb20gJy4vbGliL2NyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSc7XG5pbXBvcnQgeyByZW1vdmUgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgZmluZENvbW1hbmQgZnJvbSAnLi9saWIvZmluZENvbW1hbmQnO1xuaW1wb3J0IGluaXRUZW1wb3JhcnlQYWNrYWdlIGZyb20gJy4vbGliL2luaXRUZW1wb3JhcnlQYWNrYWdlJztcbmltcG9ydCB7IElZUFhBcmd1bWVudHNJbnB1dCwgSVJ1bnRpbWVDYWNoZSwgSVlQWEFyZ3VtZW50cyB9IGZyb20gJy4vbGliL3R5cGVzJztcbmltcG9ydCBoYW5kbGVPcHRpb25zIGZyb20gJy4vbGliL2hhbmRsZU9wdGlvbnMnO1xuaW1wb3J0IGhhbmRsZUVudiBmcm9tICcuL2xpYi9oYW5kbGVFbnYnO1xuaW1wb3J0IGluc3RhbGxEZXBlbmRlbmNpZXMgZnJvbSAnLi9saWIvaW5zdGFsbERlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyBpbnNwZWN0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgbmV3TG9nZ2VyIGZyb20gJy4vbGliL2xvZ2dlcic7XG5pbXBvcnQgYmluRXhpc3RzIGZyb20gJ2Jpbi1leGlzdHMnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IFlweEVycm9yIH0gZnJvbSAnLi9saWIvZXJyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFlQWChfYXJndjogSVlQWEFyZ3VtZW50c0lucHV0LCBpbnB1dEFyZ3Y/OiBzdHJpbmdbXSlcbntcblx0bGV0IGFyZ3YgPSBfYXJndiBhcyBSZXF1aXJlZDxJWVBYQXJndW1lbnRzPjtcblxuXHRpZiAoIWFyZ3YucGFja2FnZT8ubGVuZ3RoKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBwYWNrYWdlIG5hbWUgaXMgbmVlZGApXG5cdH1cblxuXHRhcmd2ID0gYXdhaXQgaGFuZGxlT3B0aW9ucyhhcmd2KTtcblxuXHRpZiAoYXJndi5fLmxlbmd0aCA+IDEpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGNvbW1hbmQgbm90IGludmFsaWQsICR7YXJndi5ffWApXG5cdH1cblxuXHRsZXQgcnVudGltZTogSVJ1bnRpbWVDYWNoZSA9IHtcblx0XHR0bXBEaXI6IGF3YWl0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSgpLFxuXHRcdGNyZWF0ZWQ6IGZhbHNlLFxuXHRcdHNraXBJbnN0YWxsOiB7fSxcblx0XHRjb25zb2xlOiBuZXdMb2dnZXIoYXJndiksXG5cdH07XG5cblx0Y29uc3QgY29uc29sZVNob3cgPSBuZXdMb2dnZXIoe1xuXHRcdC4uLmFyZ3YsXG5cdFx0cXVpZXQ6IGZhbHNlLFxuXHR9KTtcblxuXHRjb25zdCB7IGNvbnNvbGUgfSA9IHJ1bnRpbWU7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoKVxuXHRcdC50aGVuKGFzeW5jICgpID0+IHtcblx0XHRcdGxldCBsYWJlbCA9ICd5cHgnO1xuXG5cdFx0XHRjb25zb2xlLnRpbWUobGFiZWwpO1xuXHRcdFx0Y29uc29sZS50aW1lKGBpbnN0YWxsZWRgKTtcblxuXHRcdFx0YXdhaXQgaW5pdFRlbXBvcmFyeVBhY2thZ2UocnVudGltZS50bXBEaXIpXG5cdFx0XHRcdC50YXBDYXRjaChlID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBmYWlsZWQgY3JlYXRlIHRlbXAgcGFja2FnZSwgJHtydW50aW1lLnRtcERpcn1gKVxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHQvL2NvbnNvbGUuZGlyKGFyZ3YpO1xuXG5cdFx0XHRhd2FpdCBpbnN0YWxsRGVwZW5kZW5jaWVzKGFyZ3YsIHJ1bnRpbWUpO1xuXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMocnVudGltZS5za2lwSW5zdGFsbCkubGVuZ3RoKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmluZm8oYHNraXAgaW5zdGFsbGAsIGluc3BlY3QocnVudGltZS5za2lwSW5zdGFsbCksIGBvciBtYXliZSB1IHdhbm5hIHVzZSAtLWlnbm9yZS1leGlzdGluZ2ApXG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUudGltZUVuZChgaW5zdGFsbGVkYCk7XG5cblx0XHRcdGxldCBjb21tYW5kID0gYXJndi5fWzBdID8/IGFyZ3YucGFja2FnZVthcmd2LnBhY2thZ2UubGVuZ3RoIC0gMV07XG5cdFx0XHRsZXQgY21kX2V4aXN0czogYm9vbGVhbjtcblxuXHRcdFx0aWYgKCEoY29tbWFuZCBpbiBydW50aW1lLnNraXBJbnN0YWxsKSlcblx0XHRcdHtcblx0XHRcdFx0YXdhaXQgZmluZENvbW1hbmQoY29tbWFuZCwgcnVudGltZS50bXBEaXIpXG5cdFx0XHRcdFx0LmNhdGNoKGVyciA9PiBudWxsKVxuXHRcdFx0XHRcdC50aGVuKGJpbiA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5kZWJ1Zyhjb21tYW5kLCBgPT5gLCBiaW4pO1xuXHRcdFx0XHRcdFx0aWYgKGJpbilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZCA9IGJpbjtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNtZF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghY21kX2V4aXN0cylcblx0XHRcdHtcblx0XHRcdFx0YXdhaXQgYmluRXhpc3RzKGNvbW1hbmQpXG5cdFx0XHRcdFx0LmNhdGNoKGUgPT4gbnVsbClcblx0XHRcdFx0XHQudGhlbihib29sID0+IHtcblxuXHRcdFx0XHRcdFx0aWYgKGJvb2wpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgZm91bmQgY29tbWFuZCAnJHtjb21tYW5kfScsIGJ1dCBpdCBtYXliZSBub3QgYSBtb2R1bGUgYmluYClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKGBjb21tYW5kIG5vdCBmb3VuZDogJHtjb21tYW5kfSwgbWF5YmUgd2lsbCBub3QgY2FsbGFibGVgKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGVudiA9IHJ1bnRpbWUuZW52ID0gYXdhaXQgaGFuZGxlRW52KGFyZ3YsIHJ1bnRpbWUpO1xuXG5cdFx0XHRjb25zb2xlLnRpbWUoYGV4ZWNgKTtcblxuXHRcdFx0Y29uc29sZS5kZWJ1ZyhgW0NXRF1gLCBhcmd2LmN3ZCk7XG5cdFx0XHRpZiAoYXJndi51c2VyY29uZmlnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmRlYnVnKGBbUkNdYCwgYXJndi51c2VyY29uZmlnKTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuZGVidWcoYFtFWEVDXWAsIGNvbW1hbmQsIGFyZ3ZbJy0tJ10pO1xuXHRcdFx0YXdhaXQgY3Jvc3NTcGF3bkV4dHJhKGNvbW1hbmQsIGFyZ3ZbJy0tJ10sIHtcblx0XHRcdFx0c3RkaW86ICdpbmhlcml0Jyxcblx0XHRcdFx0ZW52LFxuXHRcdFx0XHRjd2Q6IGFyZ3YuY3dkLFxuXHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGUgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKCFjbWRfZXhpc3RzICYmIGUuY29kZSA9PT0gJ0VOT0VOVCcpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZVNob3cubWFnZW50YS5lcnJvcihgY29tbWFuZCBub3QgZm91bmQ6ICR7Y29tbWFuZH1gKTtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5lcnJvcihlKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZChgZXhlY2ApO1xuXHRcdFx0XHRcdFx0Y29uc29sZS50aW1lRW5kKGxhYmVsKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBZcHhFcnJvcigxKSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQoYGV4ZWNgKTtcblxuXHRcdFx0Y29uc29sZS50aW1lKGByZW1vdmUgdGVtcCBwYWNrYWdlYCk7XG5cdFx0XHRhd2FpdCByZW1vdmUocnVudGltZS50bXBEaXIpO1xuXHRcdFx0Y29uc29sZS50aW1lRW5kKGByZW1vdmUgdGVtcCBwYWNrYWdlYCk7XG5cblx0XHRcdGNvbnNvbGUudGltZUVuZChsYWJlbCk7XG5cdFx0fSlcblx0XHQudGFwQ2F0Y2goYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKS5jYXRjaChlcnIgPT4gbnVsbCk7XG5cdFx0fSlcblx0XHQudGFwKGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IHJlbW92ZShydW50aW1lLnRtcERpcikuY2F0Y2goZXJyID0+IG51bGwpO1xuXHRcdH0pXG5cdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgWVBYO1xuIl19
