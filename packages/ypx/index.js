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

    if (/^[^@]+@.+/.test(command)) {
      command = command.replace(/^([^@]+)@.+/, '$1');
      delete runtime.skipInstall[command];
    }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsIl9hcmd2IiwiaW5wdXRBcmd2IiwiYXJndiIsInBhY2thZ2UiLCJsZW5ndGgiLCJFcnJvciIsIl8iLCJydW50aW1lIiwidG1wRGlyIiwiY3JlYXRlZCIsInNraXBJbnN0YWxsIiwiY29uc29sZSIsImNvbnNvbGVTaG93IiwicXVpZXQiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJ0aGVuIiwibGFiZWwiLCJ0aW1lIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJPYmplY3QiLCJrZXlzIiwiaW5mbyIsInRpbWVFbmQiLCJjb21tYW5kIiwiY21kX2V4aXN0cyIsInRlc3QiLCJyZXBsYWNlIiwiY2F0Y2giLCJlcnIiLCJiaW4iLCJwYXRocyIsImN3ZCIsImZpbHRlciIsInYiLCJuYW1lIiwidW5kZWZpbmVkIiwiYm9vbCIsIndhcm4iLCJlbnYiLCJkZWJ1ZyIsInVzZXJjb25maWciLCJjcCIsInN0ZGlvIiwiY29kZSIsIm1hZ2VudGEiLCJQcm9taXNlIiwicmVqZWN0IiwiWXB4RXJyb3IiLCJleGl0Q29kZSIsInRhcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxlQUFlQSxHQUFmLENBQW1CQyxLQUFuQixFQUE4Q0MsU0FBOUMsRUFDUDtBQUFBOztBQUNDLE1BQUlDLElBQUksR0FBR0YsS0FBWDs7QUFFQSxNQUFJLG1CQUFDRSxJQUFJLENBQUNDLE9BQU4sa0RBQUMsY0FBY0MsTUFBZixDQUFKLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUosQ0FBVyxzQkFBWCxDQUFOO0FBQ0E7O0FBRURILEVBQUFBLElBQUksR0FBRyxNQUFNLDRCQUFjQSxJQUFkLENBQWI7O0FBRUEsTUFBSUEsSUFBSSxDQUFDSSxDQUFMLENBQU9GLE1BQVAsR0FBZ0IsQ0FBcEIsRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHdCQUF1QkgsSUFBSSxDQUFDSSxDQUFFLEVBQXpDLENBQU47QUFDQTs7QUFFRCxNQUFJQyxPQUFzQixHQUFHO0FBQzVCQyxJQUFBQSxNQUFNLEVBQUUsTUFBTSx3Q0FEYztBQUU1QkMsSUFBQUEsT0FBTyxFQUFFLEtBRm1CO0FBRzVCQyxJQUFBQSxXQUFXLEVBQUUsRUFIZTtBQUk1QkMsSUFBQUEsT0FBTyxFQUFFLHFCQUFVVCxJQUFWO0FBSm1CLEdBQTdCO0FBT0EsUUFBTVUsV0FBVyxHQUFHLHFCQUFVLEVBQzdCLEdBQUdWLElBRDBCO0FBRTdCVyxJQUFBQSxLQUFLLEVBQUU7QUFGc0IsR0FBVixDQUFwQjtBQUtBLFFBQU07QUFBRUYsSUFBQUE7QUFBRixNQUFjSixPQUFwQjtBQUVBLFNBQU9PLGtCQUFTQyxPQUFULEdBQ0xDLElBREssQ0FDQSxZQUFZO0FBQUE7O0FBQ2pCLFFBQUlDLEtBQUssR0FBRyxLQUFaO0FBRUFOLElBQUFBLE9BQU8sQ0FBQ08sSUFBUixDQUFhRCxLQUFiO0FBQ0FOLElBQUFBLE9BQU8sQ0FBQ08sSUFBUixDQUFjLFdBQWQ7QUFFQSxVQUFNLG1DQUFxQlgsT0FBTyxDQUFDQyxNQUE3QixFQUNKVyxRQURJLENBQ0tDLENBQUMsSUFDWDtBQUNDVCxNQUFBQSxPQUFPLENBQUNVLEtBQVIsQ0FBZSwrQkFBOEJkLE9BQU8sQ0FBQ0MsTUFBTyxFQUE1RDtBQUNBLEtBSkksQ0FBTjtBQU9BLFVBQU0sa0NBQW9CTixJQUFwQixFQUEwQkssT0FBMUIsQ0FBTjs7QUFFQSxRQUFJZSxNQUFNLENBQUNDLElBQVAsQ0FBWWhCLE9BQU8sQ0FBQ0csV0FBcEIsRUFBaUNOLE1BQXJDLEVBQ0E7QUFDQ08sTUFBQUEsT0FBTyxDQUFDYSxJQUFSLENBQWMsY0FBZCxFQUE2QixtQkFBUWpCLE9BQU8sQ0FBQ0csV0FBaEIsQ0FBN0IsRUFBNEQsd0NBQTVEO0FBQ0E7O0FBRURDLElBQUFBLE9BQU8sQ0FBQ2MsT0FBUixDQUFpQixXQUFqQjtBQUVBLFFBQUlDLE9BQU8sZUFBR3hCLElBQUksQ0FBQ0ksQ0FBTCxDQUFPLENBQVAsQ0FBSCwrQ0FBZ0JKLElBQUksQ0FBQ0MsT0FBTCxDQUFhRCxJQUFJLENBQUNDLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixDQUFuQyxDQUEzQjtBQUNBLFFBQUl1QixVQUFKOztBQUVBLFFBQUksWUFBWUMsSUFBWixDQUFpQkYsT0FBakIsQ0FBSixFQUNBO0FBQ0NBLE1BQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUNmRyxPQURRLENBQ0EsYUFEQSxFQUNlLElBRGYsQ0FBVjtBQUlBLGFBQU90QixPQUFPLENBQUNHLFdBQVIsQ0FBb0JnQixPQUFwQixDQUFQO0FBQ0E7O0FBRUQsUUFBSSxFQUFFQSxPQUFPLElBQUluQixPQUFPLENBQUNHLFdBQXJCLENBQUosRUFDQTtBQUNDLFlBQU0sMEJBQVlnQixPQUFaLEVBQXFCbkIsT0FBTyxDQUFDQyxNQUE3QixFQUNKc0IsS0FESSxDQUNFQyxHQUFHLElBQUksSUFEVCxFQUVKZixJQUZJLENBRUNnQixHQUFHLElBQ1Q7QUFFQyxZQUFJQSxHQUFKLEVBQ0E7QUFDQ04sVUFBQUEsT0FBTyxHQUFHTSxHQUFWO0FBQ0FMLFVBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0EsU0FKRCxNQU1BO0FBQ0NBLFVBQUFBLFVBQVUsR0FBRyxLQUFiO0FBQ0E7QUFDRCxPQWRJLENBQU47QUFnQkE7O0FBRUQsUUFBSSxDQUFDQSxVQUFMLEVBQ0E7QUFDQyxVQUFJTSxLQUFLLEdBQUcsQ0FDWDFCLE9BQU8sQ0FBQ0MsTUFERyxFQUVYTixJQUFJLENBQUNnQyxHQUZNLEVBR1ZDLE1BSFUsQ0FHSEMsQ0FBQyxJQUFJQSxDQUhGLENBQVo7QUFLQSxZQUFNdEIsa0JBQVNDLE9BQVQsR0FDSkMsSUFESSxDQUNDb0IsQ0FBQyxJQUFJLGtDQUFrQjtBQUM1QkMsUUFBQUEsSUFBSSxFQUFFbkMsSUFBSSxDQUFDQyxPQUFMLENBQWFELElBQUksQ0FBQ0MsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLENBQW5DLENBRHNCO0FBRTVCNkIsUUFBQUEsS0FBSyxFQUFFQSxLQUFLLENBQUM3QixNQUFOLEdBQWU2QixLQUFmLEdBQXVCSztBQUZGLE9BQWxCLEVBR1JaLE9BSFEsQ0FETixFQU1KSSxLQU5JLENBTUVDLEdBQUcsSUFBSSxJQU5ULEVBT0pmLElBUEksQ0FPQ2dCLEdBQUcsSUFDVDtBQUVDLFlBQUlBLEdBQUosRUFDQTtBQUNDTixVQUFBQSxPQUFPLEdBQUdNLEdBQVY7QUFDQUwsVUFBQUEsVUFBVSxHQUFHLElBQWI7QUFDQSxTQUpELE1BTUE7QUFDQ0EsVUFBQUEsVUFBVSxHQUFHLEtBQWI7QUFDQTtBQUNELE9BbkJJLENBQU47QUFvQkE7O0FBRUQsUUFBSSxDQUFDQSxVQUFMLEVBQ0E7QUFDQyxZQUFNLHdCQUFVRCxPQUFWLEVBQ0pJLEtBREksQ0FDRVYsQ0FBQyxJQUFJLElBRFAsRUFFSkosSUFGSSxDQUVDdUIsSUFBSSxJQUFJO0FBRWIsWUFBSUEsSUFBSixFQUNBO0FBQ0M1QixVQUFBQSxPQUFPLENBQUM2QixJQUFSLENBQWMsa0JBQWlCZCxPQUFRLGtDQUF2QztBQUNBLFNBSEQsTUFLQTtBQUNDZixVQUFBQSxPQUFPLENBQUM2QixJQUFSLENBQWMsc0JBQXFCZCxPQUFRLDJCQUEzQztBQUNBO0FBQ0QsT0FaSSxDQUFOO0FBY0E7O0FBRUQsUUFBSWUsR0FBRyxHQUFHbEMsT0FBTyxDQUFDa0MsR0FBUixHQUFjLE1BQU0sd0JBQVV2QyxJQUFWLEVBQWdCSyxPQUFoQixDQUE5QjtBQUVBSSxJQUFBQSxPQUFPLENBQUNPLElBQVIsQ0FBYyxNQUFkO0FBRUFQLElBQUFBLE9BQU8sQ0FBQytCLEtBQVIsQ0FBZSxPQUFmLEVBQXVCeEMsSUFBSSxDQUFDZ0MsR0FBNUI7O0FBQ0EsUUFBSWhDLElBQUksQ0FBQ3lDLFVBQVQsRUFDQTtBQUNDaEMsTUFBQUEsT0FBTyxDQUFDK0IsS0FBUixDQUFlLE1BQWYsRUFBc0J4QyxJQUFJLENBQUN5QyxVQUEzQjtBQUNBOztBQUNEaEMsSUFBQUEsT0FBTyxDQUFDK0IsS0FBUixDQUFlLFFBQWYsRUFBd0JoQixPQUF4QixFQUFpQ3hCLElBQUksQ0FBQyxJQUFELENBQXJDO0FBQ0EsUUFBSTBDLEVBQUUsR0FBRyxNQUFNLDhCQUFnQmxCLE9BQWhCLEVBQXlCeEIsSUFBSSxDQUFDLElBQUQsQ0FBN0IsRUFBcUM7QUFDbkQyQyxNQUFBQSxLQUFLLEVBQUUsU0FENEM7QUFFbkRKLE1BQUFBLEdBRm1EO0FBR25EUCxNQUFBQSxHQUFHLEVBQUVoQyxJQUFJLENBQUNnQztBQUh5QyxLQUFyQyxFQUtiSixLQUxhLENBS1BWLENBQUMsSUFBSTtBQUVYLFVBQUksQ0FBQ08sVUFBRCxJQUFlUCxDQUFDLENBQUMwQixJQUFGLEtBQVcsUUFBOUIsRUFDQTtBQUNDbEMsUUFBQUEsV0FBVyxDQUFDbUMsT0FBWixDQUFvQjFCLEtBQXBCLENBQTJCLHNCQUFxQkssT0FBUSxFQUF4RDtBQUVBZixRQUFBQSxPQUFPLENBQUNjLE9BQVIsQ0FBaUIsTUFBakI7QUFDQWQsUUFBQUEsT0FBTyxDQUFDYyxPQUFSLENBQWdCUixLQUFoQjtBQUVBLGVBQU8rQixPQUFPLENBQUNDLE1BQVIsQ0FBZSxJQUFJQyxhQUFKLENBQWEsQ0FBYixDQUFmLENBQVA7QUFDQTs7QUFFRCxhQUFPRixPQUFPLENBQUNDLE1BQVIsQ0FBZTdCLENBQWYsQ0FBUDtBQUNBLEtBbEJhLENBQWY7QUFxQkFULElBQUFBLE9BQU8sQ0FBQ2MsT0FBUixDQUFpQixNQUFqQjtBQUVBZCxJQUFBQSxPQUFPLENBQUNPLElBQVIsQ0FBYyxxQkFBZDtBQUNBLFVBQU0scUJBQU9YLE9BQU8sQ0FBQ0MsTUFBZixDQUFOO0FBQ0FHLElBQUFBLE9BQU8sQ0FBQ2MsT0FBUixDQUFpQixxQkFBakI7QUFFQWQsSUFBQUEsT0FBTyxDQUFDYyxPQUFSLENBQWdCUixLQUFoQjs7QUFHQSxRQUFJMkIsRUFBRSxDQUFDTyxRQUFQLEVBQ0E7QUFFQyxhQUFPLElBQUlELGFBQUosQ0FBYU4sRUFBRSxDQUFDTyxRQUFoQixDQUFQO0FBQ0E7QUFDRCxHQW5KSyxFQW9KTGhDLFFBcEpLLENBb0pJLFlBQVk7QUFDckIsVUFBTSxxQkFBT1osT0FBTyxDQUFDQyxNQUFmLEVBQXVCc0IsS0FBdkIsQ0FBNkJDLEdBQUcsSUFBSSxJQUFwQyxDQUFOO0FBQ0EsR0F0SkssRUF1SkxxQixHQXZKSyxDQXVKRCxZQUFZO0FBQ2hCLFVBQU0scUJBQU83QyxPQUFPLENBQUNDLE1BQWYsRUFBdUJzQixLQUF2QixDQUE2QkMsR0FBRyxJQUFJLElBQXBDLENBQU47QUFDQSxHQXpKSyxDQUFQO0FBMkpBOztlQUVjaEMsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8yOC5cbiAqL1xuXG5pbXBvcnQgY3Jvc3NTcGF3bkV4dHJhIGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkgZnJvbSAnLi9saWIvY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5JztcbmltcG9ydCB7IHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBmaW5kQ29tbWFuZCBmcm9tICcuL2xpYi9maW5kQ29tbWFuZCc7XG5pbXBvcnQgaW5pdFRlbXBvcmFyeVBhY2thZ2UgZnJvbSAnLi9saWIvaW5pdFRlbXBvcmFyeVBhY2thZ2UnO1xuaW1wb3J0IHsgSVlQWEFyZ3VtZW50c0lucHV0LCBJUnVudGltZUNhY2hlLCBJWVBYQXJndW1lbnRzIH0gZnJvbSAnLi9saWIvdHlwZXMnO1xuaW1wb3J0IGhhbmRsZU9wdGlvbnMgZnJvbSAnLi9saWIvaGFuZGxlT3B0aW9ucyc7XG5pbXBvcnQgaGFuZGxlRW52IGZyb20gJy4vbGliL2hhbmRsZUVudic7XG5pbXBvcnQgaW5zdGFsbERlcGVuZGVuY2llcyBmcm9tICcuL2xpYi9pbnN0YWxsRGVwZW5kZW5jaWVzJztcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJztcbmltcG9ydCBuZXdMb2dnZXIgZnJvbSAnLi9saWIvbG9nZ2VyJztcbmltcG9ydCBiaW5FeGlzdHMgZnJvbSAnYmluLWV4aXN0cyc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgWXB4RXJyb3IgfSBmcm9tICcuL2xpYi9lcnInO1xuaW1wb3J0IHsgZGVmYXVsdFBhY2thZ2VCaW4gfSBmcm9tICdAeWFybi10b29sL2dldC1wa2ctYmluJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFlQWChfYXJndjogSVlQWEFyZ3VtZW50c0lucHV0LCBpbnB1dEFyZ3Y/OiBzdHJpbmdbXSlcbntcblx0bGV0IGFyZ3YgPSBfYXJndiBhcyBSZXF1aXJlZDxJWVBYQXJndW1lbnRzPjtcblxuXHRpZiAoIWFyZ3YucGFja2FnZT8ubGVuZ3RoKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBwYWNrYWdlIG5hbWUgaXMgbmVlZGApXG5cdH1cblxuXHRhcmd2ID0gYXdhaXQgaGFuZGxlT3B0aW9ucyhhcmd2KTtcblxuXHRpZiAoYXJndi5fLmxlbmd0aCA+IDEpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGNvbW1hbmQgbm90IGludmFsaWQsICR7YXJndi5ffWApXG5cdH1cblxuXHRsZXQgcnVudGltZTogSVJ1bnRpbWVDYWNoZSA9IHtcblx0XHR0bXBEaXI6IGF3YWl0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSgpLFxuXHRcdGNyZWF0ZWQ6IGZhbHNlLFxuXHRcdHNraXBJbnN0YWxsOiB7fSxcblx0XHRjb25zb2xlOiBuZXdMb2dnZXIoYXJndiksXG5cdH07XG5cblx0Y29uc3QgY29uc29sZVNob3cgPSBuZXdMb2dnZXIoe1xuXHRcdC4uLmFyZ3YsXG5cdFx0cXVpZXQ6IGZhbHNlLFxuXHR9KTtcblxuXHRjb25zdCB7IGNvbnNvbGUgfSA9IHJ1bnRpbWU7XG5cblx0cmV0dXJuIEJsdWViaXJkLnJlc29sdmUoKVxuXHRcdC50aGVuKGFzeW5jICgpID0+IHtcblx0XHRcdGxldCBsYWJlbCA9ICd5cHgnO1xuXG5cdFx0XHRjb25zb2xlLnRpbWUobGFiZWwpO1xuXHRcdFx0Y29uc29sZS50aW1lKGBpbnN0YWxsZWRgKTtcblxuXHRcdFx0YXdhaXQgaW5pdFRlbXBvcmFyeVBhY2thZ2UocnVudGltZS50bXBEaXIpXG5cdFx0XHRcdC50YXBDYXRjaChlID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBmYWlsZWQgY3JlYXRlIHRlbXAgcGFja2FnZSwgJHtydW50aW1lLnRtcERpcn1gKVxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRhd2FpdCBpbnN0YWxsRGVwZW5kZW5jaWVzKGFyZ3YsIHJ1bnRpbWUpO1xuXG5cdFx0XHRpZiAoT2JqZWN0LmtleXMocnVudGltZS5za2lwSW5zdGFsbCkubGVuZ3RoKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmluZm8oYHNraXAgaW5zdGFsbGAsIGluc3BlY3QocnVudGltZS5za2lwSW5zdGFsbCksIGBvciBtYXliZSB1IHdhbm5hIHVzZSAtLWlnbm9yZS1leGlzdGluZ2ApXG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUudGltZUVuZChgaW5zdGFsbGVkYCk7XG5cblx0XHRcdGxldCBjb21tYW5kID0gYXJndi5fWzBdID8/IGFyZ3YucGFja2FnZVthcmd2LnBhY2thZ2UubGVuZ3RoIC0gMV07XG5cdFx0XHRsZXQgY21kX2V4aXN0czogYm9vbGVhbjtcblxuXHRcdFx0aWYgKC9eW15AXStALisvLnRlc3QoY29tbWFuZCkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbW1hbmQgPSBjb21tYW5kXG5cdFx0XHRcdFx0LnJlcGxhY2UoL14oW15AXSspQC4rLywgJyQxJylcblx0XHRcdFx0O1xuXG5cdFx0XHRcdGRlbGV0ZSBydW50aW1lLnNraXBJbnN0YWxsW2NvbW1hbmRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIShjb21tYW5kIGluIHJ1bnRpbWUuc2tpcEluc3RhbGwpKVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBmaW5kQ29tbWFuZChjb21tYW5kLCBydW50aW1lLnRtcERpcilcblx0XHRcdFx0XHQuY2F0Y2goZXJyID0+IG51bGwpXG5cdFx0XHRcdFx0LnRoZW4oYmluID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmRlYnVnKGNvbW1hbmQsIGA9PmAsIGJpbik7XG5cdFx0XHRcdFx0XHRpZiAoYmluKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb21tYW5kID0gYmluO1xuXHRcdFx0XHRcdFx0XHRjbWRfZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFjbWRfZXhpc3RzKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgcGF0aHMgPSBbXG5cdFx0XHRcdFx0cnVudGltZS50bXBEaXIsXG5cdFx0XHRcdFx0YXJndi5jd2QsXG5cdFx0XHRcdF0uZmlsdGVyKHYgPT4gdik7XG5cblx0XHRcdFx0YXdhaXQgQmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0XHRcdFx0LnRoZW4odiA9PiBkZWZhdWx0UGFja2FnZUJpbih7XG5cdFx0XHRcdFx0XHRuYW1lOiBhcmd2LnBhY2thZ2VbYXJndi5wYWNrYWdlLmxlbmd0aCAtIDFdLFxuXHRcdFx0XHRcdFx0cGF0aHM6IHBhdGhzLmxlbmd0aCA/IHBhdGhzIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdH0sIGNvbW1hbmQpKVxuXHRcdFx0XHRcdC8vLnRhcENhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpXG5cdFx0XHRcdFx0LmNhdGNoKGVyciA9PiBudWxsKVxuXHRcdFx0XHRcdC50aGVuKGJpbiA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5kZWJ1Zyhjb21tYW5kLCBgPT5gLCBiaW4pO1xuXHRcdFx0XHRcdFx0aWYgKGJpbilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZCA9IGJpbjtcblx0XHRcdFx0XHRcdFx0Y21kX2V4aXN0cyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNtZF9leGlzdHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWNtZF9leGlzdHMpXG5cdFx0XHR7XG5cdFx0XHRcdGF3YWl0IGJpbkV4aXN0cyhjb21tYW5kKVxuXHRcdFx0XHRcdC5jYXRjaChlID0+IG51bGwpXG5cdFx0XHRcdFx0LnRoZW4oYm9vbCA9PiB7XG5cblx0XHRcdFx0XHRcdGlmIChib29sKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oYGZvdW5kIGNvbW1hbmQgJyR7Y29tbWFuZH0nLCBidXQgaXQgbWF5YmUgbm90IGEgbW9kdWxlIGJpbmApXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgY29tbWFuZCBub3QgZm91bmQ6ICR7Y29tbWFuZH0sIG1heWJlIHdpbGwgbm90IGNhbGxhYmxlYClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBlbnYgPSBydW50aW1lLmVudiA9IGF3YWl0IGhhbmRsZUVudihhcmd2LCBydW50aW1lKTtcblxuXHRcdFx0Y29uc29sZS50aW1lKGBleGVjYCk7XG5cblx0XHRcdGNvbnNvbGUuZGVidWcoYFtDV0RdYCwgYXJndi5jd2QpO1xuXHRcdFx0aWYgKGFyZ3YudXNlcmNvbmZpZylcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5kZWJ1ZyhgW1JDXWAsIGFyZ3YudXNlcmNvbmZpZyk7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmRlYnVnKGBbRVhFQ11gLCBjb21tYW5kLCBhcmd2WyctLSddKTtcblx0XHRcdGxldCBjcCA9IGF3YWl0IGNyb3NzU3Bhd25FeHRyYShjb21tYW5kLCBhcmd2WyctLSddLCB7XG5cdFx0XHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0XHRcdGVudixcblx0XHRcdFx0Y3dkOiBhcmd2LmN3ZCxcblx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChlID0+IHtcblxuXHRcdFx0XHRcdGlmICghY21kX2V4aXN0cyAmJiBlLmNvZGUgPT09ICdFTk9FTlQnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnNvbGVTaG93Lm1hZ2VudGEuZXJyb3IoYGNvbW1hbmQgbm90IGZvdW5kOiAke2NvbW1hbmR9YCk7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLnRpbWVFbmQoYGV4ZWNgKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZChsYWJlbCk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgWXB4RXJyb3IoMSkpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcblx0XHRcdFx0fSlcblx0XHRcdDtcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kKGBleGVjYCk7XG5cblx0XHRcdGNvbnNvbGUudGltZShgcmVtb3ZlIHRlbXAgcGFja2FnZWApO1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKTtcblx0XHRcdGNvbnNvbGUudGltZUVuZChgcmVtb3ZlIHRlbXAgcGFja2FnZWApO1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQobGFiZWwpO1xuXG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRpZiAoY3AuZXhpdENvZGUpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0cmV0dXJuIG5ldyBZcHhFcnJvcihjcC5leGl0Q29kZSlcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50YXBDYXRjaChhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCByZW1vdmUocnVudGltZS50bXBEaXIpLmNhdGNoKGVyciA9PiBudWxsKTtcblx0XHR9KVxuXHRcdC50YXAoYXN5bmMgKCkgPT4ge1xuXHRcdFx0YXdhaXQgcmVtb3ZlKHJ1bnRpbWUudG1wRGlyKS5jYXRjaChlcnIgPT4gbnVsbCk7XG5cdFx0fSlcblx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBZUFg7XG4iXX0=
