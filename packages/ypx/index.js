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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsImFyZ3YiLCJwYWNrYWdlIiwibGVuZ3RoIiwiRXJyb3IiLCJsYWJlbCIsImNvbnNvbGUiLCJ0aW1lIiwiXyIsImN3ZCIsInByb2Nlc3MiLCJjb21tYW5kIiwidG1wRGlyIiwiQmx1ZWJpcmQiLCJhbGwiLCJqb2luIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJxdWlldCIsInByZWZlck9mZmxpbmUiLCJmaWx0ZXIiLCJ2Iiwic3RyaXBBbnNpIiwic3RkaW8iLCJncmVlbiIsInRpbWVFbmQiLCJ0aGVuIiwiYmluIiwiY2F0Y2giLCJlcnIiLCJwYXRocyIsInBhdGgiLCJhcHBlbmQiLCJlbnYiLCJnZXQiLCJQYXRoIiwiUEFUSCIsImRlYnVnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFDQTs7OztBQUVPLGVBQWVBLEdBQWYsQ0FBbUJDLElBQW5CLEVBTVA7QUFBQTs7QUFDQyxNQUFJLG1CQUFDQSxJQUFJLENBQUNDLE9BQU4sa0RBQUMsY0FBY0MsTUFBZixDQUFKLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUosQ0FBVyxzQkFBWCxDQUFOO0FBQ0E7O0FBRUQsTUFBSUMsS0FBSyxHQUFHLEtBQVo7O0FBRUFDLGtCQUFRQyxJQUFSLENBQWFGLEtBQWI7O0FBRUEsTUFBSSxZQUFBSixJQUFJLENBQUNPLENBQUwsb0RBQVFMLE1BQVIsSUFBaUIsQ0FBckIsRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHdCQUF1QkgsSUFBSSxDQUFDTyxDQUFFLEVBQXpDLENBQU47QUFDQTs7QUFFRFAsRUFBQUEsSUFBSSxDQUFDUSxHQUFMLGdCQUFXUixJQUFJLENBQUNRLEdBQWhCLGlEQUF1QkMsT0FBTyxDQUFDRCxHQUFSLEVBQXZCO0FBRUEsTUFBSUUsT0FBTyxHQUFHVixJQUFJLENBQUNPLENBQUwsQ0FBTyxDQUFQLENBQWQ7O0FBRUFGLGtCQUFR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QU9LLE1BQVAsQ0FBTjs7QUFDQU4sa0JBQVFvQixPQUFSLENBQWlCLHFCQUFqQjs7QUFFQXBCLGtCQUFRbUIsS0FBUixDQUFjQyxPQUFkLENBQXNCckIsS0FBdEI7QUFDQTs7ZUFFY0wsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8yOC5cbiAqL1xuXG5pbXBvcnQgY3Jvc3NTcGF3bkV4dHJhIGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkgZnJvbSAnLi9saWIvY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5JztcbmltcG9ydCB7IGpvaW4sIGRlbGltaXRlciB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgd3JpdGVGaWxlLCByZW1vdmUsIHdyaXRlSlNPTiwgcGF0aEV4aXN0c1N5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgQXJndW1lbnRzIH0gZnJvbSAneWFyZ3MtcGFyc2VyLWV4dHJhJ1xuaW1wb3J0IHsgSVRTUmVxdWlyZWRXaXRoIH0gZnJvbSAndHMtdHlwZSdcbmltcG9ydCBjb25zb2xlIGZyb20gJ2RlYnVnLWNvbG9yMi9sb2dnZXInXG5pbXBvcnQgZmluZENvbW1hbmQgZnJvbSAnLi9saWIvZmluZENvbW1hbmQnO1xuaW1wb3J0IHsgcGF0aFN0cmluZywgcGF0aEVudiB9IGZyb20gJ3BhdGgtZW52J1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gWVBYKGFyZ3Y6IElUU1JlcXVpcmVkV2l0aDxBcmd1bWVudHM8e1xuXHRwYWNrYWdlOiBzdHJpbmdbXSxcblx0cXVpZXQ/OiBib29sZWFuLFxufT4sICdwYWNrYWdlJz4gJiB7XG5cdGN3ZD86IHN0cmluZyxcbn0pXG57XG5cdGlmICghYXJndi5wYWNrYWdlPy5sZW5ndGgpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYHBhY2thZ2UgbmFtZSBpcyBuZWVkYClcblx0fVxuXG5cdGxldCBsYWJlbCA9ICd5cHgnO1xuXG5cdGNvbnNvbGUudGltZShsYWJlbCk7XG5cblx0aWYgKGFyZ3YuXz8ubGVuZ3RoID4gMSlcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihgY29tbWFuZCBub3QgaW52YWxpZCwgJHthcmd2Ll99YClcblx0fVxuXG5cdGFyZ3YuY3dkID0gYXJndi5jd2QgPz8gcHJvY2Vzcy5jd2QoKTtcblxuXHRsZXQgY29tbWFuZCA9IGFyZ3YuX1swXTtcblxuXHRjb25zb2xlLnRpbWUoYGluc3RhbGxlZGApO1xuXG5cdGxldCB0bXBEaXIgPSBhd2FpdCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkoKTtcblxuXHRhd2FpdCBCbHVlYmlyZC5hbGwoW1xuXHRcdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAnLnlhcm5yYycpLCBbXG5cdFx0XHRcdGBlbmFibGVHbG9iYWxDYWNoZSB0cnVlYCxcblx0XHRcdFx0YGRpc2FibGUtc2VsZi11cGRhdGUtY2hlY2sgdHJ1ZWAsXG5cdFx0XHRdLmpvaW4oJ1xcbicpICsgJ1xcbicpLFxuXHRcdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAnLnlhcm5yYy55bWwnKSwgW1xuXHRcdFx0XHRgZW5hYmxlR2xvYmFsQ2FjaGU6IHRydWVgLFxuXHRcdFx0XHRgZGlzYWJsZVNlbGZVcGRhdGVDaGVjazogdHJ1ZWAsXG5cdFx0XHRdLmpvaW4oJ1xcbicpICsgJ1xcbicpLFxuXHRcdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAneWFybi5sb2NrJyksIGBgKSxcblx0XHRcdHdyaXRlSlNPTihqb2luKHRtcERpciwgJ3BhY2thZ2UuanNvbicpLCB7XG5cdFx0XHRcdFwibGljZW5zZVwiOiBcIklTQ1wiLFxuXHRcdFx0fSksXG5cdFx0XSlcblx0XHQudGFwQ2F0Y2goZSA9PlxuXHRcdHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGZhaWxlZCBjcmVhdGUgdGVtcCBwYWNrYWdlLCAke3RtcERpcn1gKVxuXHRcdH0pXG5cdDtcblxuXHQvL2NvbnNvbGUuZGlyKGFyZ3YpO1xuXG5cdGF3YWl0IGNyb3NzU3Bhd25FeHRyYSgneWFybicsIFtcblx0XHQnYWRkJyxcblx0XHQuLi5hcmd2LnBhY2thZ2UsXG5cdFx0KGFyZ3YucXVpZXQgPyAnLS1xdWlldCcgOiBudWxsKSxcblx0XHQoYXJndi5wcmVmZXJPZmZsaW5lID8gJy0tcmVmZXItb2ZmbGluZScgOiBudWxsKSxcblx0XHQnLS1saW5rLWR1cGxpY2F0ZXMnLFxuXHRcdCctLW5vLW5vZGUtdmVyc2lvbi1jaGVjaycsXG5cdFx0Jy0taWdub3JlLW9wdGlvbmFsJyxcblx0XS5maWx0ZXIodiA9PiB2ICE9IG51bGwpLCB7XG5cdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdGN3ZDogdG1wRGlyLFxuXHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdH0pO1xuXG5cdGNvbnNvbGUuZ3JlZW4udGltZUVuZChgaW5zdGFsbGVkYCk7XG5cblx0YXdhaXQgZmluZENvbW1hbmQoY29tbWFuZCA9IGNvbW1hbmQgPz8gYXJndi5wYWNrYWdlW2FyZ3YucGFja2FnZS5sZW5ndGggLSAxXSwgdG1wRGlyKVxuXHRcdC50aGVuKGJpbiA9PiB7XG5cdFx0XHQvL2NvbnNvbGUuZGVidWcoY29tbWFuZCwgYD0+YCwgYmluKTtcblx0XHRcdGNvbW1hbmQgPSBiaW47XG5cdFx0fSlcblx0XHQuY2F0Y2goZXJyID0+IG51bGwpXG5cdDtcblxuXHRsZXQgcGF0aHMgPSBwYXRoRW52KClcblx0XHQucGF0aC5hcHBlbmQoW3RtcERpcl0pXG5cdDtcblxuXHRsZXQgZW52ID0gcGF0aHMuZ2V0LmVudigpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGVudi5wYXRoID0gZW52LlBhdGggPSBlbnYuUEFUSDtcblxuXHQvL2NvbnNvbGUuZGlyKGVudik7XG5cdC8vY29uc29sZS5kaXIocGF0aHMucGF0aC5nZXQuc3RyaW5nKCkpO1xuXG5cdGNvbnNvbGUudGltZShgZXhlY2ApO1xuXG5cdGNvbnNvbGUuZGVidWcoYFtDV0RdYCwgYXJndi5jd2QpO1xuXHRjb25zb2xlLmRlYnVnKGBbRVhFQ11gLCBjb21tYW5kLCBhcmd2WyctLSddID8/ICcnKTtcblx0YXdhaXQgY3Jvc3NTcGF3bkV4dHJhKGNvbW1hbmQsIGFyZ3ZbJy0tJ10sIHtcblx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdGVudjogcGF0aHMuZ2V0LmVudigpLFxuXHRcdGN3ZDogYXJndi5jd2QsXG5cdH0pO1xuXG5cdGNvbnNvbGUudGltZUVuZChgZXhlY2ApO1xuXG5cdGNvbnNvbGUudGltZShgcmVtb3ZlIHRlbXAgcGFja2FnZWApO1xuXHRhd2FpdCByZW1vdmUodG1wRGlyKTtcblx0Y29uc29sZS50aW1lRW5kKGByZW1vdmUgdGVtcCBwYWNrYWdlYCk7XG5cblx0Y29uc29sZS5ncmVlbi50aW1lRW5kKGxhYmVsKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgWVBYO1xuIl19
