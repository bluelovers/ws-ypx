Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installDependencies = installDependencies;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _findCommand = _interopRequireDefault(require("./findCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function installDependencies(argv, runtime) {
  let pkgs = argv.package.slice();

  if (argv.ignoreExisting) {} else {
    pkgs = await _bluebird.default.resolve(pkgs).filter(async name => {
      let r;

      try {
        r = require.resolve(name + '/package.json', {
          paths: [argv.cwd]
        });
        runtime.skipInstall[name] = r;
        return false;
      } catch (e) {}

      if (r = await (0, _findCommand.default)(name, argv.cwd)) {
        runtime.skipInstall[name] = r;
        return false;
      }

      return true;
    });
  }

  if (pkgs.length) {
    if (argv.noInstall) {
      pkgs.forEach(name => runtime.skipInstall[name] = undefined);
    } else {
      await (0, _crossSpawnExtra.default)('yarn', ['add', ...pkgs, argv.quiet ? '--quiet' : null, argv.preferOffline ? '--refer-offline' : null, '--link-duplicates', '--no-node-version-check', '--ignore-optional'].filter(v => v != null), {
        stripAnsi: true,
        cwd: runtime.tmpDir,
        stdio: argv.quiet ? undefined : 'inherit'
      });
    }
  }
}

var _default = installDependencies;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluc3RhbGxEZXBlbmRlbmNpZXMudHMiXSwibmFtZXMiOlsiaW5zdGFsbERlcGVuZGVuY2llcyIsImFyZ3YiLCJydW50aW1lIiwicGtncyIsInBhY2thZ2UiLCJzbGljZSIsImlnbm9yZUV4aXN0aW5nIiwiQmx1ZWJpcmQiLCJyZXNvbHZlIiwiZmlsdGVyIiwibmFtZSIsInIiLCJyZXF1aXJlIiwicGF0aHMiLCJjd2QiLCJza2lwSW5zdGFsbCIsImUiLCJsZW5ndGgiLCJub0luc3RhbGwiLCJmb3JFYWNoIiwidW5kZWZpbmVkIiwicXVpZXQiLCJwcmVmZXJPZmZsaW5lIiwidiIsInN0cmlwQW5zaSIsInRtcERpciIsInN0ZGlvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUdPLGVBQWVBLG1CQUFmLENBQW1DQyxJQUFuQyxFQUF3REMsT0FBeEQsRUFDUDtBQUNDLE1BQUlDLElBQUksR0FBR0YsSUFBSSxDQUFDRyxPQUFMLENBQWFDLEtBQWIsRUFBWDs7QUFFQSxNQUFJSixJQUFJLENBQUNLLGNBQVQsRUFDQSxDQUVDLENBSEQsTUFLQTtBQUNDSCxJQUFBQSxJQUFJLEdBQUcsTUFBTUksa0JBQVNDLE9BQVQsQ0FBaUJMLElBQWpCLEVBQ1hNLE1BRFcsQ0FDSixNQUFPQyxJQUFQLElBQWdCO0FBRXZCLFVBQUlDLENBQUo7O0FBRUEsVUFDQTtBQUNDQSxRQUFBQSxDQUFDLEdBQUdDLE9BQU8sQ0FBQ0osT0FBUixDQUFnQkUsSUFBSSxHQUFHLGVBQXZCLEVBQXdDO0FBQzNDRyxVQUFBQSxLQUFLLEVBQUUsQ0FBQ1osSUFBSSxDQUFDYSxHQUFOO0FBRG9DLFNBQXhDLENBQUo7QUFHQVosUUFBQUEsT0FBTyxDQUFDYSxXQUFSLENBQW9CTCxJQUFwQixJQUE0QkMsQ0FBNUI7QUFDQSxlQUFPLEtBQVA7QUFDQSxPQVBELENBUUEsT0FBT0ssQ0FBUCxFQUNBLENBRUM7O0FBRUQsVUFBSUwsQ0FBQyxHQUFHLE1BQU0sMEJBQVlELElBQVosRUFBa0JULElBQUksQ0FBQ2EsR0FBdkIsQ0FBZCxFQUNBO0FBQ0NaLFFBQUFBLE9BQU8sQ0FBQ2EsV0FBUixDQUFvQkwsSUFBcEIsSUFBNEJDLENBQTVCO0FBQ0EsZUFBTyxLQUFQO0FBQ0E7O0FBRUQsYUFBTyxJQUFQO0FBQ0EsS0F6QlcsQ0FBYjtBQTJCQTs7QUFFRCxNQUFJUixJQUFJLENBQUNjLE1BQVQsRUFDQTtBQUNDLFFBQUloQixJQUFJLENBQUNpQixTQUFULEVBQ0E7QUFDQ2YsTUFBQUEsSUFBSSxDQUFDZ0IsT0FBTCxDQUFhVCxJQUFJLElBQUlSLE9BQU8sQ0FBQ2EsV0FBUixDQUFvQkwsSUFBcEIsSUFBNEJVLFNBQWpEO0FBQ0EsS0FIRCxNQUtBO0FBQ0MsWUFBTSw4QkFBZ0IsTUFBaEIsRUFBd0IsQ0FDN0IsS0FENkIsRUFFN0IsR0FBR2pCLElBRjBCLEVBRzVCRixJQUFJLENBQUNvQixLQUFMLEdBQWEsU0FBYixHQUF5QixJQUhHLEVBSTVCcEIsSUFBSSxDQUFDcUIsYUFBTCxHQUFxQixpQkFBckIsR0FBeUMsSUFKYixFQUs3QixtQkFMNkIsRUFNN0IseUJBTjZCLEVBTzdCLG1CQVA2QixFQVE1QmIsTUFSNEIsQ0FRckJjLENBQUMsSUFBSUEsQ0FBQyxJQUFJLElBUlcsQ0FBeEIsRUFRb0I7QUFDekJDLFFBQUFBLFNBQVMsRUFBRSxJQURjO0FBRXpCVixRQUFBQSxHQUFHLEVBQUVaLE9BQU8sQ0FBQ3VCLE1BRlk7QUFHekJDLFFBQUFBLEtBQUssRUFBRXpCLElBQUksQ0FBQ29CLEtBQUwsR0FBYUQsU0FBYixHQUF5QjtBQUhQLE9BUnBCLENBQU47QUFhQTtBQUNEO0FBQ0Q7O2VBRWNwQixtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElUU1JlcXVpcmVkV2l0aCB9IGZyb20gJ3RzLXR5cGUnO1xuaW1wb3J0IHsgSVlQWEFyZ3VtZW50cywgSVJ1bnRpbWVDYWNoZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IGNyb3NzU3Bhd25FeHRyYSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGZpbmRDb21tYW5kIGZyb20gJy4vZmluZENvbW1hbmQnO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zdGFsbERlcGVuZGVuY2llcyhhcmd2OiBJWVBYQXJndW1lbnRzLCBydW50aW1lOiBJUnVudGltZUNhY2hlKVxue1xuXHRsZXQgcGtncyA9IGFyZ3YucGFja2FnZS5zbGljZSgpO1xuXG5cdGlmIChhcmd2Lmlnbm9yZUV4aXN0aW5nKVxuXHR7XG5cblx0fVxuXHRlbHNlXG5cdHtcblx0XHRwa2dzID0gYXdhaXQgQmx1ZWJpcmQucmVzb2x2ZShwa2dzKVxuXHRcdFx0LmZpbHRlcihhc3luYyAobmFtZSkgPT4ge1xuXG5cdFx0XHRcdGxldCByOiBzdHJpbmc7XG5cblx0XHRcdFx0dHJ5XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyID0gcmVxdWlyZS5yZXNvbHZlKG5hbWUgKyAnL3BhY2thZ2UuanNvbicsIHtcblx0XHRcdFx0XHRcdHBhdGhzOiBbYXJndi5jd2RdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cnVudGltZS5za2lwSW5zdGFsbFtuYW1lXSA9IHI7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKVxuXHRcdFx0XHR7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyID0gYXdhaXQgZmluZENvbW1hbmQobmFtZSwgYXJndi5jd2QpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cnVudGltZS5za2lwSW5zdGFsbFtuYW1lXSA9IHI7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9KVxuXHRcdDtcblx0fVxuXG5cdGlmIChwa2dzLmxlbmd0aClcblx0e1xuXHRcdGlmIChhcmd2Lm5vSW5zdGFsbClcblx0XHR7XG5cdFx0XHRwa2dzLmZvckVhY2gobmFtZSA9PiBydW50aW1lLnNraXBJbnN0YWxsW25hbWVdID0gdW5kZWZpbmVkKVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0YXdhaXQgY3Jvc3NTcGF3bkV4dHJhKCd5YXJuJywgW1xuXHRcdFx0XHQnYWRkJyxcblx0XHRcdFx0Li4ucGtncyxcblx0XHRcdFx0KGFyZ3YucXVpZXQgPyAnLS1xdWlldCcgOiBudWxsKSxcblx0XHRcdFx0KGFyZ3YucHJlZmVyT2ZmbGluZSA/ICctLXJlZmVyLW9mZmxpbmUnIDogbnVsbCksXG5cdFx0XHRcdCctLWxpbmstZHVwbGljYXRlcycsXG5cdFx0XHRcdCctLW5vLW5vZGUtdmVyc2lvbi1jaGVjaycsXG5cdFx0XHRcdCctLWlnbm9yZS1vcHRpb25hbCcsXG5cdFx0XHRdLmZpbHRlcih2ID0+IHYgIT0gbnVsbCksIHtcblx0XHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdFx0XHRjd2Q6IHJ1bnRpbWUudG1wRGlyLFxuXHRcdFx0XHRzdGRpbzogYXJndi5xdWlldCA/IHVuZGVmaW5lZCA6ICdpbmhlcml0Jyxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbnN0YWxsRGVwZW5kZW5jaWVzXG4iXX0=