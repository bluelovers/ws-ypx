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

  _logger.default.time(`remove tmp`);

  await (0, _fsExtra.remove)(tmpDir);

  _logger.default.timeEnd(`remove tmp`);

  _logger.default.green.timeEnd(label);
}

var _default = YPX;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIllQWCIsImFyZ3YiLCJwYWNrYWdlIiwibGVuZ3RoIiwiRXJyb3IiLCJsYWJlbCIsImNvbnNvbGUiLCJ0aW1lIiwiXyIsImN3ZCIsInByb2Nlc3MiLCJjb21tYW5kIiwidG1wRGlyIiwiQmx1ZWJpcmQiLCJhbGwiLCJqb2luIiwidGFwQ2F0Y2giLCJlIiwiZXJyb3IiLCJkaXIiLCJxdWlldCIsInByZWZlck9mZmxpbmUiLCJmaWx0ZXIiLCJ2Iiwic3RyaXBBbnNpIiwic3RkaW8iLCJncmVlbiIsInRpbWVFbmQiLCJ0aGVuIiwiYmluIiwiY2F0Y2giLCJlcnIiLCJwYXRocyIsInBhdGgiLCJhcHBlbmQiLCJlbnYiLCJnZXQiLCJQYXRoIiwiUEFUSCIsImRlYnVnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFDQTs7OztBQUVPLGVBQWVBLEdBQWYsQ0FBbUJDLElBQW5CLEVBTVA7QUFBQTs7QUFDQyxNQUFJLG1CQUFDQSxJQUFJLENBQUNDLE9BQU4sa0RBQUMsY0FBY0MsTUFBZixDQUFKLEVBQ0E7QUFDQyxVQUFNLElBQUlDLEtBQUosQ0FBVyxzQkFBWCxDQUFOO0FBQ0E7O0FBRUQsTUFBSUMsS0FBSyxHQUFHLEtBQVo7O0FBRUFDLGtCQUFRQyxJQUFSLENBQWFGLEtBQWI7O0FBRUEsTUFBSSxZQUFBSixJQUFJLENBQUNPLENBQUwsb0RBQVFMLE1BQVIsSUFBaUIsQ0FBckIsRUFDQTtBQUNDLFVBQU0sSUFBSUMsS0FBSixDQUFXLHdCQUF1QkgsSUFBSSxDQUFDTyxDQUFFLEVBQXpDLENBQU47QUFDQTs7QUFFRFAsRUFBQUEsSUFBSSxDQUFDUSxHQUFMLGdCQUFXUixJQUFJLENBQUNRLEdBQWhCLGlEQUF1QkMsT0FBTyxDQUFDRCxHQUFSLEVBQXZCO0FBRUEsTUFBSUUsT0FBTyxHQUFHVixJQUFJLENBQUNPLENBQUwsQ0FBTyxDQUFQLENBQWQ7O0FBRUFG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ckIsa0JBQVFDLElBQVIsQ0FBYyxZQUFkOztBQUNBLFFBQU0scUJBQU9LLE1BQVAsQ0FBTjs7QUFDQU4sa0JBQVFxQixPQUFSLENBQWlCLFlBQWpCOztBQUVBckIsa0JBQVFvQixLQUFSLENBQWNDLE9BQWQsQ0FBc0J0QixLQUF0QjtBQUNBOztlQUVjTCxHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5cbmltcG9ydCBjcm9zc1NwYXduRXh0cmEgZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSBmcm9tICcuL2xpYi9jcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnknO1xuaW1wb3J0IHsgam9pbiwgZGVsaW1pdGVyIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZUZpbGUsIHJlbW92ZSwgd3JpdGVKU09OLCBwYXRoRXhpc3RzU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBBcmd1bWVudHMgfSBmcm9tICd5YXJncy1wYXJzZXItZXh0cmEnXG5pbXBvcnQgeyBJVFNSZXF1aXJlZFdpdGggfSBmcm9tICd0cy10eXBlJ1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZGVidWctY29sb3IyL2xvZ2dlcidcbmltcG9ydCBmaW5kQ29tbWFuZCBmcm9tICcuL2xpYi9maW5kQ29tbWFuZCc7XG5pbXBvcnQgeyBwYXRoU3RyaW5nLCBwYXRoRW52IH0gZnJvbSAncGF0aC1lbnYnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBZUFgoYXJndjogSVRTUmVxdWlyZWRXaXRoPEFyZ3VtZW50czx7XG5cdHBhY2thZ2U6IHN0cmluZ1tdLFxuXHRxdWlldD86IGJvb2xlYW4sXG59PiwgJ3BhY2thZ2UnPiAmIHtcblx0Y3dkPzogc3RyaW5nLFxufSlcbntcblx0aWYgKCFhcmd2LnBhY2thZ2U/Lmxlbmd0aClcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihgcGFja2FnZSBuYW1lIGlzIG5lZWRgKVxuXHR9XG5cblx0bGV0IGxhYmVsID0gJ3lweCc7XG5cblx0Y29uc29sZS50aW1lKGxhYmVsKTtcblxuXHRpZiAoYXJndi5fPy5sZW5ndGggPiAxKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBjb21tYW5kIG5vdCBpbnZhbGlkLCAke2FyZ3YuX31gKVxuXHR9XG5cblx0YXJndi5jd2QgPSBhcmd2LmN3ZCA/PyBwcm9jZXNzLmN3ZCgpO1xuXG5cdGxldCBjb21tYW5kID0gYXJndi5fWzBdO1xuXG5cdGNvbnNvbGUudGltZShgaW5zdGFsbGVkYCk7XG5cblx0bGV0IHRtcERpciA9IGF3YWl0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSgpO1xuXG5cdGF3YWl0IEJsdWViaXJkLmFsbChbXG5cdFx0XHR3cml0ZUZpbGUoam9pbih0bXBEaXIsICcueWFybnJjJyksIFtcblx0XHRcdFx0YGVuYWJsZUdsb2JhbENhY2hlIHRydWVgLFxuXHRcdFx0XHRgZGlzYWJsZS1zZWxmLXVwZGF0ZS1jaGVjayB0cnVlYCxcblx0XHRcdF0uam9pbignXFxuJykgKyAnXFxuJyksXG5cdFx0XHR3cml0ZUZpbGUoam9pbih0bXBEaXIsICcueWFybnJjLnltbCcpLCBbXG5cdFx0XHRcdGBlbmFibGVHbG9iYWxDYWNoZTogdHJ1ZWAsXG5cdFx0XHRcdGBkaXNhYmxlU2VsZlVwZGF0ZUNoZWNrOiB0cnVlYCxcblx0XHRcdF0uam9pbignXFxuJykgKyAnXFxuJyksXG5cdFx0XHR3cml0ZUZpbGUoam9pbih0bXBEaXIsICd5YXJuLmxvY2snKSwgYGApLFxuXHRcdFx0d3JpdGVKU09OKGpvaW4odG1wRGlyLCAncGFja2FnZS5qc29uJyksIHtcblx0XHRcdFx0XCJsaWNlbnNlXCI6IFwiSVNDXCIsXG5cdFx0XHR9KSxcblx0XHRdKVxuXHRcdC50YXBDYXRjaChlID0+XG5cdFx0e1xuXHRcdFx0Y29uc29sZS5lcnJvcihgZmFpbGVkIGNyZWF0ZSB0ZW1wIHBhY2thZ2UsICR7dG1wRGlyfWApXG5cdFx0fSlcblx0O1xuXG5cdGNvbnNvbGUuZGlyKGFyZ3YpO1xuXG5cdGF3YWl0IGNyb3NzU3Bhd25FeHRyYSgneWFybicsIFtcblx0XHQnYWRkJyxcblx0XHQuLi5hcmd2LnBhY2thZ2UsXG5cdFx0KGFyZ3YucXVpZXQgPyAnLS1xdWlldCcgOiBudWxsKSxcblx0XHQoYXJndi5wcmVmZXJPZmZsaW5lID8gJy0tcmVmZXItb2ZmbGluZScgOiBudWxsKSxcblx0XHQnLS1saW5rLWR1cGxpY2F0ZXMnLFxuXHRcdCctLW5vLW5vZGUtdmVyc2lvbi1jaGVjaycsXG5cdFx0Jy0taWdub3JlLW9wdGlvbmFsJyxcblx0XS5maWx0ZXIodiA9PiB2ICE9IG51bGwpLCB7XG5cdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdGN3ZDogdG1wRGlyLFxuXHRcdHN0ZGlvOiAnaW5oZXJpdCcsXG5cdH0pO1xuXG5cdGNvbnNvbGUuZ3JlZW4udGltZUVuZChgaW5zdGFsbGVkYCk7XG5cblx0YXdhaXQgZmluZENvbW1hbmQoY29tbWFuZCA9IGNvbW1hbmQgPz8gYXJndi5wYWNrYWdlW2FyZ3YucGFja2FnZS5sZW5ndGggLSAxXSwgdG1wRGlyKVxuXHRcdC50aGVuKGJpbiA9PiB7XG5cdFx0XHQvL2NvbnNvbGUuZGVidWcoY29tbWFuZCwgYD0+YCwgYmluKTtcblx0XHRcdGNvbW1hbmQgPSBiaW47XG5cdFx0fSlcblx0XHQuY2F0Y2goZXJyID0+IG51bGwpXG5cdDtcblxuXHRsZXQgcGF0aHMgPSBwYXRoRW52KClcblx0XHQucGF0aC5hcHBlbmQoW3RtcERpcl0pXG5cdDtcblxuXHRsZXQgZW52ID0gcGF0aHMuZ2V0LmVudigpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGVudi5wYXRoID0gZW52LlBhdGggPSBlbnYuUEFUSDtcblxuXHQvL2NvbnNvbGUuZGlyKGVudik7XG5cdC8vY29uc29sZS5kaXIocGF0aHMucGF0aC5nZXQuc3RyaW5nKCkpO1xuXG5cdGNvbnNvbGUudGltZShgZXhlY2ApO1xuXG5cdGNvbnNvbGUuZGVidWcoYFtDV0RdYCwgYXJndi5jd2QpO1xuXHRjb25zb2xlLmRlYnVnKGBbRVhFQ11gLCBjb21tYW5kLCBhcmd2WyctLSddID8/ICcnKTtcblx0YXdhaXQgY3Jvc3NTcGF3bkV4dHJhKGNvbW1hbmQsIGFyZ3ZbJy0tJ10sIHtcblx0XHRzdGRpbzogJ2luaGVyaXQnLFxuXHRcdGVudjogcGF0aHMuZ2V0LmVudigpLFxuXHRcdGN3ZDogYXJndi5jd2QsXG5cdH0pO1xuXG5cdGNvbnNvbGUudGltZUVuZChgZXhlY2ApO1xuXG5cdGNvbnNvbGUudGltZShgcmVtb3ZlIHRtcGApO1xuXHRhd2FpdCByZW1vdmUodG1wRGlyKTtcblx0Y29uc29sZS50aW1lRW5kKGByZW1vdmUgdG1wYCk7XG5cblx0Y29uc29sZS5ncmVlbi50aW1lRW5kKGxhYmVsKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgWVBYO1xuIl19
