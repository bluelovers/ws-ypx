Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YPX = YPX;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _createTemporaryDirectory = _interopRequireDefault(require("./lib/createTemporaryDirectory"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _logger = _interopRequireDefault(require("debug-color2/logger"));

var _findCommand = _interopRequireDefault(require("./lib/findCommand"));

var _pathEnv = require("path-env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function YPX(argv) {
  var _argv$package, _argv$_, _argv$cwd, _command, _argv$;

  if (!((_argv$package = argv.package) === null || _argv$package === void 0 ? void 0 : _argv$package.length)) {
    throw new Error(`package name is need`);
  }

  let label = 'ypx';

  _logger.default.time(label);

  if (((_argv$_ = argv._) === null || _argv$_ === void 0 ? void 0 : _argv$_.length) > 1) {
    throw new Error(`command not invalid, ${argv._}`);
  }

  argv.cwd = (_argv$cwd = argv.cwd) !== null && _argv$cwd !== void 0 ? _argv$cwd : process.cwd();
  let command = argv._[0];

  _logger.default.time(`installed`);

  let tmpDir = await (0, _createTemporaryDirectory.default)();
  await _bluebird.default.all([(0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc'), [`enableGlobalCache true`, `disable-self-update-check true`].join('\n') + '\n'), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc.yml'), [`enableGlobalCache: true`, `disableSelfUpdateCheck: true`].join('\n') + '\n'), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, 'yarn.lock'), ``), (0, _fsExtra.writeJSON)((0, _path.join)(tmpDir, 'package.json'), {
    "license": "ISC"
  })]).tapCatch(e => {
    _logger.default.error(`failed create temp package, ${tmpDir}`);
  });

  _logger.default.dir(argv);

  await (0, _crossSpawnExtra.default)('yarn', ['add', ...argv.package, argv.quiet ? '--quiet' : null, argv.preferOffline ? '--refer-offline' : null, '--link-duplicates', '--no-node-version-check', '--ignore-optional'].filter(v => v != null), {
    stripAnsi: true,
    cwd: tmpDir,
    stdio: 'inherit'
  });

  _logger.default.green.timeEnd(`installed`);

  await (0, _findCommand.default)(command = (_command = command) !== null && _command !== void 0 ? _command : argv.package[argv.package.length - 1], tmpDir).then(bin => {
    command = bin;
  }).catch(err => null);
  let paths = (0, _pathEnv.pathEnv)().path.append([tmpDir]);
  let env = paths.get.env();
  env.path = env.Path = env.PATH;

  _logger.default.time(`exec`);

  _logger.default.debug(`[CWD]`, argv.cwd);

  _logger.default.debug(`[EXEC]`, command, (_argv$ = argv['--']) !== null && _argv$ !== void 0 ? _argv$ : '');

  await (0, _crossSpawnExtra.default)(command, argv['--'], {
    stdio: 'inherit',
    env: paths.get.env(),
    cwd: argv.cwd
  });

  _logger.default.timeEnd(`exec`);

  _logger.default.time(`remove temp package`);

  await (0, _fsExtra.remove)(tmpDir);

  _logger.default.timeEnd(`remove temp package`);

  _logger.default.green.timeEnd(label);
}

var _default = YPX;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsImFyZ3YiLCJwYWNrYWdlIiwibGVuZ3RoIiwiRXJyb3IiLCJsYWJlbCIsImNvbnNvbGUiLCJ0aW1lIiwiXyIsImN3ZCIsInByb2Nlc3MiLCJjb21tYW5kIiwidG1wRGlyIiwiQmx1ZWJpcmQiLCJhbGwiLCJqb2luIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJkaXIiLCJxdWlldCIsInByZWZlck9mZmxpbmUiLCJmaWx0ZXIiLCJ2Iiwic3RyaXBBbnNpIiwic3RkaW8iLCJncmVlbiIsInRpbWVFbmQiLCJ0aGVuIiwiYmluIiwiY2F0Y2giLCJlcnIiLCJwYXRocyIsInBhdGgiLCJhcHBlbmQiLCJlbnYiLCJnZXQiLCJQYXRoIiwiUEFUSCIsImRlYnVnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFDQTs7OztBQUVPLGVBQWVBLEdBQWYsQ0FBbUJDLElBQW5CLEVBTVA7QUFBQTs7QUFDQyxNQUFJLG1CQUFDQSxJQUFJLENBQUNDLE9BQU4sa0RBQUMsY0FBY0MsTUFBZixDQUFKLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUosQ0FBVyxzQkFBWCxDQUFOO0FBQ0E7O0FBRUQsTUFBSUMsS0FBSyxHQUFHLEtBQVo7O0FBRUFDLGtCQUFRQyxJQUFSLENBQWFGLEtBQWI7O0FBRUEsTUFBSSxZQUFBSixJQUFJLENBQUNPLENBQUwsb0RBQVFMLE1BQVIsSUFBaUIsQ0FBckIsRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHdCQUF1QkgsSUFBSSxDQUFDTyxDQUFFLEVBQXpDLENBQU47QUFDQTs7QUFFRFAsRUFBQUEsSUFBSSxDQUFDUSxHQUFMLGdCQUFXUixJQUFJLENBQUNRLEdBQWhCLGlEQUF1QkMsT0FBTyxDQUFDRCxHQUFSLEVBQXZCO0FBRUEsTUFBSUUsT0FBTyxHQUFHVixJQUFJLENBQUNPLENBQUwsQ0FBTyxDQUFQLENBQWQ7O0FBRUFG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ckIsa0JBQVFDLElBQVIsQ0FBYyxxQkFBZDs7QUFDQSxRQUFNLHFCQUFPSyxNQUFQLENBQU47O0FBQ0FOLGtCQUFRcUIsT0FBUixDQUFpQixxQkFBakI7O0FBRUFyQixrQkFBUW9CLEtBQVIsQ0FBY0MsT0FBZCxDQUFzQnRCLEtBQXRCO0FBQ0E7O2VBRWNMLEciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMjguXG4gKi9cblxuaW1wb3J0IGNyb3NzU3Bhd25FeHRyYSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5IGZyb20gJy4vbGliL2NyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSc7XG5pbXBvcnQgeyBqb2luLCBkZWxpbWl0ZXIgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHdyaXRlRmlsZSwgcmVtb3ZlLCB3cml0ZUpTT04sIHBhdGhFeGlzdHNTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IEFyZ3VtZW50cyB9IGZyb20gJ3lhcmdzLXBhcnNlci1leHRyYSdcbmltcG9ydCB7IElUU1JlcXVpcmVkV2l0aCB9IGZyb20gJ3RzLXR5cGUnXG5pbXBvcnQgY29uc29sZSBmcm9tICdkZWJ1Zy1jb2xvcjIvbG9nZ2VyJ1xuaW1wb3J0IGZpbmRDb21tYW5kIGZyb20gJy4vbGliL2ZpbmRDb21tYW5kJztcbmltcG9ydCB7IHBhdGhTdHJpbmcsIHBhdGhFbnYgfSBmcm9tICdwYXRoLWVudidcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFlQWChhcmd2OiBJVFNSZXF1aXJlZFdpdGg8QXJndW1lbnRzPHtcblx0cGFja2FnZTogc3RyaW5nW10sXG5cdHF1aWV0PzogYm9vbGVhbixcbn0+LCAncGFja2FnZSc+ICYge1xuXHRjd2Q/OiBzdHJpbmcsXG59KVxue1xuXHRpZiAoIWFyZ3YucGFja2FnZT8ubGVuZ3RoKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBwYWNrYWdlIG5hbWUgaXMgbmVlZGApXG5cdH1cblxuXHRsZXQgbGFiZWwgPSAneXB4JztcblxuXHRjb25zb2xlLnRpbWUobGFiZWwpO1xuXG5cdGlmIChhcmd2Ll8/Lmxlbmd0aCA+IDEpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGNvbW1hbmQgbm90IGludmFsaWQsICR7YXJndi5ffWApXG5cdH1cblxuXHRhcmd2LmN3ZCA9IGFyZ3YuY3dkID8/IHByb2Nlc3MuY3dkKCk7XG5cblx0bGV0IGNvbW1hbmQgPSBhcmd2Ll9bMF07XG5cblx0Y29uc29sZS50aW1lKGBpbnN0YWxsZWRgKTtcblxuXHRsZXQgdG1wRGlyID0gYXdhaXQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KCk7XG5cblx0YXdhaXQgQmx1ZWJpcmQuYWxsKFtcblx0XHRcdHdyaXRlRmlsZShqb2luKHRtcERpciwgJy55YXJucmMnKSwgW1xuXHRcdFx0XHRgZW5hYmxlR2xvYmFsQ2FjaGUgdHJ1ZWAsXG5cdFx0XHRcdGBkaXNhYmxlLXNlbGYtdXBkYXRlLWNoZWNrIHRydWVgLFxuXHRcdFx0XS5qb2luKCdcXG4nKSArICdcXG4nKSxcblx0XHRcdHdyaXRlRmlsZShqb2luKHRtcERpciwgJy55YXJucmMueW1sJyksIFtcblx0XHRcdFx0YGVuYWJsZUdsb2JhbENhY2hlOiB0cnVlYCxcblx0XHRcdFx0YGRpc2FibGVTZWxmVXBkYXRlQ2hlY2s6IHRydWVgLFxuXHRcdFx0XS5qb2luKCdcXG4nKSArICdcXG4nKSxcblx0XHRcdHdyaXRlRmlsZShqb2luKHRtcERpciwgJ3lhcm4ubG9jaycpLCBgYCksXG5cdFx0XHR3cml0ZUpTT04oam9pbih0bXBEaXIsICdwYWNrYWdlLmpzb24nKSwge1xuXHRcdFx0XHRcImxpY2Vuc2VcIjogXCJJU0NcIixcblx0XHRcdH0pLFxuXHRcdF0pXG5cdFx0LnRhcENhdGNoKGUgPT5cblx0XHR7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBmYWlsZWQgY3JlYXRlIHRlbXAgcGFja2FnZSwgJHt0bXBEaXJ9YClcblx0XHR9KVxuXHQ7XG5cblx0Y29uc29sZS5kaXIoYXJndik7XG5cblx0YXdhaXQgY3Jvc3NTcGF3bkV4dHJhKCd5YXJuJywgW1xuXHRcdCdhZGQnLFxuXHRcdC4uLmFyZ3YucGFja2FnZSxcblx0XHQoYXJndi5xdWlldCA/ICctLXF1aWV0JyA6IG51bGwpLFxuXHRcdChhcmd2LnByZWZlck9mZmxpbmUgPyAnLS1yZWZlci1vZmZsaW5lJyA6IG51bGwpLFxuXHRcdCctLWxpbmstZHVwbGljYXRlcycsXG5cdFx0Jy0tbm8tbm9kZS12ZXJzaW9uLWNoZWNrJyxcblx0XHQnLS1pZ25vcmUtb3B0aW9uYWwnLFxuXHRdLmZpbHRlcih2ID0+IHYgIT0gbnVsbCksIHtcblx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdFx0Y3dkOiB0bXBEaXIsXG5cdFx0c3RkaW86ICdpbmhlcml0Jyxcblx0fSk7XG5cblx0Y29uc29sZS5ncmVlbi50aW1lRW5kKGBpbnN0YWxsZWRgKTtcblxuXHRhd2FpdCBmaW5kQ29tbWFuZChjb21tYW5kID0gY29tbWFuZCA/PyBhcmd2LnBhY2thZ2VbYXJndi5wYWNrYWdlLmxlbmd0aCAtIDFdLCB0bXBEaXIpXG5cdFx0LnRoZW4oYmluID0+IHtcblx0XHRcdC8vY29uc29sZS5kZWJ1Zyhjb21tYW5kLCBgPT5gLCBiaW4pO1xuXHRcdFx0Y29tbWFuZCA9IGJpbjtcblx0XHR9KVxuXHRcdC5jYXRjaChlcnIgPT4gbnVsbClcblx0O1xuXG5cdGxldCBwYXRocyA9IHBhdGhFbnYoKVxuXHRcdC5wYXRoLmFwcGVuZChbdG1wRGlyXSlcblx0O1xuXG5cdGxldCBlbnYgPSBwYXRocy5nZXQuZW52KCk7XG5cdC8vIEB0cy1pZ25vcmVcblx0ZW52LnBhdGggPSBlbnYuUGF0aCA9IGVudi5QQVRIO1xuXG5cdC8vY29uc29sZS5kaXIoZW52KTtcblx0Ly9jb25zb2xlLmRpcihwYXRocy5wYXRoLmdldC5zdHJpbmcoKSk7XG5cblx0Y29uc29sZS50aW1lKGBleGVjYCk7XG5cblx0Y29uc29sZS5kZWJ1ZyhgW0NXRF1gLCBhcmd2LmN3ZCk7XG5cdGNvbnNvbGUuZGVidWcoYFtFWEVDXWAsIGNvbW1hbmQsIGFyZ3ZbJy0tJ10gPz8gJycpO1xuXHRhd2FpdCBjcm9zc1NwYXduRXh0cmEoY29tbWFuZCwgYXJndlsnLS0nXSwge1xuXHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdFx0ZW52OiBwYXRocy5nZXQuZW52KCksXG5cdFx0Y3dkOiBhcmd2LmN3ZCxcblx0fSk7XG5cblx0Y29uc29sZS50aW1lRW5kKGBleGVjYCk7XG5cblx0Y29uc29sZS50aW1lKGByZW1vdmUgdGVtcCBwYWNrYWdlYCk7XG5cdGF3YWl0IHJlbW92ZSh0bXBEaXIpO1xuXHRjb25zb2xlLnRpbWVFbmQoYHJlbW92ZSB0ZW1wIHBhY2thZ2VgKTtcblxuXHRjb25zb2xlLmdyZWVuLnRpbWVFbmQobGFiZWwpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBZUFg7XG4iXX0=
