Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCacheDir = getCacheDir;
exports.createTmpDir = createTmpDir;
exports.createTemporaryDirectory = createTemporaryDirectory;
exports.default = void 0;

var _tmp = require("tmp");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _path = require("path");

var _crossSpawnExtra = require("cross-spawn-extra");

var _fsExtra = require("fs-extra");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCacheDir() {
  try {
    let cp = (0, _crossSpawnExtra.sync)('yarn', ['config', 'current', '--json'], {
      stripAnsi: true
    });
    let data = JSON.parse(JSON.parse(cp.stdout.toString()).data);

    if (data.tempFolder) {
      return data.tempFolder;
    }
  } catch (e) {}

  if (process.env.YARN_CACHE_FOLDER && (0, _fsExtra.pathExistsSync)(process.env.YARN_CACHE_FOLDER)) {
    return (0, _path.join)(process.env.YARN_CACHE_FOLDER, '_ypx');
  }
}

function createTmpDir() {
  return new _bluebird.default((resolve, reject) => {
    (0, _tmp.dir)({
      unsafeCleanup: false,
      prefix: 'ypx_',
      dir: getCacheDir()
    }, (error, dirPath) => {
      if (error) {
        reject(error);
      } else {
        resolve(dirPath);
      }
    });
  });
}

function createTemporaryDirectory() {
  return createTmpDir();
}

var _default = createTemporaryDirectory;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeS50cyJdLCJuYW1lcyI6WyJnZXRDYWNoZURpciIsImNwIiwic3RyaXBBbnNpIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInN0ZG91dCIsInRvU3RyaW5nIiwidGVtcEZvbGRlciIsImUiLCJwcm9jZXNzIiwiZW52IiwiWUFSTl9DQUNIRV9GT0xERVIiLCJjcmVhdGVUbXBEaXIiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJyZWplY3QiLCJ1bnNhZmVDbGVhbnVwIiwicHJlZml4IiwiZGlyIiwiZXJyb3IiLCJkaXJQYXRoIiwiY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsV0FBVCxHQUNQO0FBQ0MsTUFDQTtBQUNDLFFBQUlDLEVBQUUsR0FBRywyQkFBZ0IsTUFBaEIsRUFBd0IsQ0FDaEMsUUFEZ0MsRUFFaEMsU0FGZ0MsRUFHaEMsUUFIZ0MsQ0FBeEIsRUFJTjtBQUNGQyxNQUFBQSxTQUFTLEVBQUU7QUFEVCxLQUpNLENBQVQ7QUFRQSxRQUFJQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNDLEtBQUwsQ0FBV0osRUFBRSxDQUFDSyxNQUFILENBQVVDLFFBQVYsRUFBWCxFQUFpQ0osSUFBNUMsQ0FBWDs7QUFFQSxRQUFJQSxJQUFJLENBQUNLLFVBQVQsRUFDQTtBQUNDLGFBQU9MLElBQUksQ0FBQ0ssVUFBWjtBQUNBO0FBQ0QsR0FoQkQsQ0FpQkEsT0FBT0MsQ0FBUCxFQUNBLENBRUM7O0FBRUQsTUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGlCQUFaLElBQWlDLDZCQUFlRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQTNCLENBQXJDLEVBQ0E7QUFDQyxXQUFPLGdCQUFLRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQWpCLEVBQW9DLE1BQXBDLENBQVA7QUFDQTtBQUNEOztBQUVNLFNBQVNDLFlBQVQsR0FDUDtBQUNDLFNBQU8sSUFBSUMsaUJBQUosQ0FBcUIsQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQzVCO0FBQ0Msa0JBQU87QUFDTkMsTUFBQUEsYUFBYSxFQUFFLEtBRFQ7QUFFTkMsTUFBQUEsTUFBTSxFQUFFLE1BRkY7QUFHTkMsTUFBQUEsR0FBRyxFQUFFbkIsV0FBVztBQUhWLEtBQVAsRUFJRyxDQUFDb0IsS0FBRCxFQUFRQyxPQUFSLEtBQ0g7QUFDQyxVQUFJRCxLQUFKLEVBQ0E7QUFDQ0osUUFBQUEsTUFBTSxDQUFDSSxLQUFELENBQU47QUFDQSxPQUhELE1BS0E7QUFDQ0wsUUFBQUEsT0FBTyxDQUFDTSxPQUFELENBQVA7QUFDQTtBQUNELEtBZEQ7QUFlQSxHQWpCTSxDQUFQO0FBa0JBOztBQUVNLFNBQVNDLHdCQUFULEdBQ1A7QUFDQyxTQUFPVCxZQUFZLEVBQW5CO0FBR0E7O2VBRWNTLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5pbXBvcnQgeyBkaXIgYXMgdG1wRGlyIH0gZnJvbSAndG1wJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBzeW5jIGFzIGNyb3NzU3Bhd25FeHRyYSB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCB7IHBhdGhFeGlzdHNTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVEaXIoKTogc3RyaW5nXG57XG5cdHRyeVxuXHR7XG5cdFx0bGV0IGNwID0gY3Jvc3NTcGF3bkV4dHJhKCd5YXJuJywgW1xuXHRcdFx0J2NvbmZpZycsXG5cdFx0XHQnY3VycmVudCcsXG5cdFx0XHQnLS1qc29uJyxcblx0XHRdLCB7XG5cdFx0XHRzdHJpcEFuc2k6IHRydWVcblx0XHR9KTtcblxuXHRcdGxldCBkYXRhID0gSlNPTi5wYXJzZShKU09OLnBhcnNlKGNwLnN0ZG91dC50b1N0cmluZygpKS5kYXRhKTtcblxuXHRcdGlmIChkYXRhLnRlbXBGb2xkZXIpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGRhdGEudGVtcEZvbGRlclxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXG5cdH1cblxuXHRpZiAocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIgJiYgcGF0aEV4aXN0c1N5bmMocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIpKVxuXHR7XG5cdFx0cmV0dXJuIGpvaW4ocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIsICdfeXB4Jylcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVG1wRGlyKClcbntcblx0cmV0dXJuIG5ldyBCbHVlYmlyZDxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHR0bXBEaXIoe1xuXHRcdFx0dW5zYWZlQ2xlYW51cDogZmFsc2UsXG5cdFx0XHRwcmVmaXg6ICd5cHhfJyxcblx0XHRcdGRpcjogZ2V0Q2FjaGVEaXIoKSxcblx0XHR9LCAoZXJyb3IsIGRpclBhdGgpID0+XG5cdFx0e1xuXHRcdFx0aWYgKGVycm9yKVxuXHRcdFx0e1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZXNvbHZlKGRpclBhdGgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KClcbntcblx0cmV0dXJuIGNyZWF0ZVRtcERpcigpXG5cdFx0Ly8udGFwKHYgPT4gY29uc29sZS5kaXIodikpXG5cdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5XG4iXX0=