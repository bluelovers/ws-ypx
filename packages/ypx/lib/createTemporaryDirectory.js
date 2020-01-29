Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCacheDir = getCacheDir;
exports.createTemporaryDirectory = createTemporaryDirectory;
exports.newTemporary = newTemporary;
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

function createTemporaryDirectory() {
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

async function newTemporary() {
  let tmpDir = await createTemporaryDirectory();
  return {
    get tmpDir() {
      return tmpDir;
    },

    remove() {
      return (0, _fsExtra.remove)(tmpDir);
    }

  };
}

var _default = createTemporaryDirectory;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeS50cyJdLCJuYW1lcyI6WyJnZXRDYWNoZURpciIsImNwIiwic3RyaXBBbnNpIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInN0ZG91dCIsInRvU3RyaW5nIiwidGVtcEZvbGRlciIsImUiLCJwcm9jZXNzIiwiZW52IiwiWUFSTl9DQUNIRV9GT0xERVIiLCJjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJyZWplY3QiLCJ1bnNhZmVDbGVhbnVwIiwicHJlZml4IiwiZGlyIiwiZXJyb3IiLCJkaXJQYXRoIiwibmV3VGVtcG9yYXJ5IiwidG1wRGlyIiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsV0FBVCxHQUNQO0FBQ0MsTUFDQTtBQUNDLFFBQUlDLEVBQUUsR0FBRywyQkFBZ0IsTUFBaEIsRUFBd0IsQ0FDaEMsUUFEZ0MsRUFFaEMsU0FGZ0MsRUFHaEMsUUFIZ0MsQ0FBeEIsRUFJTjtBQUNGQyxNQUFBQSxTQUFTLEVBQUU7QUFEVCxLQUpNLENBQVQ7QUFRQSxRQUFJQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNDLEtBQUwsQ0FBV0osRUFBRSxDQUFDSyxNQUFILENBQVVDLFFBQVYsRUFBWCxFQUFpQ0osSUFBNUMsQ0FBWDs7QUFFQSxRQUFJQSxJQUFJLENBQUNLLFVBQVQsRUFDQTtBQUNDLGFBQU9MLElBQUksQ0FBQ0ssVUFBWjtBQUNBO0FBQ0QsR0FoQkQsQ0FpQkEsT0FBT0MsQ0FBUCxFQUNBLENBRUM7O0FBRUQsTUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGlCQUFaLElBQWlDLDZCQUFlRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQTNCLENBQXJDLEVBQ0E7QUFDQyxXQUFPLGdCQUFLRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQWpCLEVBQW9DLE1BQXBDLENBQVA7QUFDQTtBQUNEOztBQUVNLFNBQVNDLHdCQUFULEdBQ1A7QUFDQyxTQUFPLElBQUlDLGlCQUFKLENBQXFCLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUM1QjtBQUNDLGtCQUFPO0FBQ05DLE1BQUFBLGFBQWEsRUFBRSxLQURUO0FBRU5DLE1BQUFBLE1BQU0sRUFBRSxNQUZGO0FBR05DLE1BQUFBLEdBQUcsRUFBRW5CLFdBQVc7QUFIVixLQUFQLEVBSUcsQ0FBQ29CLEtBQUQsRUFBUUMsT0FBUixLQUNIO0FBQ0MsVUFBSUQsS0FBSixFQUNBO0FBQ0NKLFFBQUFBLE1BQU0sQ0FBQ0ksS0FBRCxDQUFOO0FBQ0EsT0FIRCxNQUtBO0FBQ0NMLFFBQUFBLE9BQU8sQ0FBQ00sT0FBRCxDQUFQO0FBQ0E7QUFDRCxLQWREO0FBZUEsR0FqQk0sQ0FBUDtBQWtCQTs7QUFFTSxlQUFlQyxZQUFmLEdBQ1A7QUFDQyxNQUFJQyxNQUFNLEdBQUcsTUFBTVYsd0JBQXdCLEVBQTNDO0FBRUEsU0FBTztBQUNOLFFBQUlVLE1BQUosR0FDQTtBQUNDLGFBQU9BLE1BQVA7QUFDQSxLQUpLOztBQUtOQyxJQUFBQSxNQUFNLEdBQ047QUFDQyxhQUFPLHFCQUFPRCxNQUFQLENBQVA7QUFDQTs7QUFSSyxHQUFQO0FBVUE7O2VBRWNWLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAyMC8xLzI4LlxuICovXG5pbXBvcnQgeyBkaXIgYXMgdG1wRGlyIH0gZnJvbSAndG1wJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBzeW5jIGFzIGNyb3NzU3Bhd25FeHRyYSB9IGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCB7IHBhdGhFeGlzdHNTeW5jLCByZW1vdmUgfSBmcm9tICdmcy1leHRyYSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZURpcigpOiBzdHJpbmdcbntcblx0dHJ5XG5cdHtcblx0XHRsZXQgY3AgPSBjcm9zc1NwYXduRXh0cmEoJ3lhcm4nLCBbXG5cdFx0XHQnY29uZmlnJyxcblx0XHRcdCdjdXJyZW50Jyxcblx0XHRcdCctLWpzb24nLFxuXHRcdF0sIHtcblx0XHRcdHN0cmlwQW5zaTogdHJ1ZVxuXHRcdH0pO1xuXG5cdFx0bGV0IGRhdGEgPSBKU09OLnBhcnNlKEpTT04ucGFyc2UoY3Auc3Rkb3V0LnRvU3RyaW5nKCkpLmRhdGEpO1xuXG5cdFx0aWYgKGRhdGEudGVtcEZvbGRlcilcblx0XHR7XG5cdFx0XHRyZXR1cm4gZGF0YS50ZW1wRm9sZGVyXG5cdFx0fVxuXHR9XG5cdGNhdGNoIChlKVxuXHR7XG5cblx0fVxuXG5cdGlmIChwcm9jZXNzLmVudi5ZQVJOX0NBQ0hFX0ZPTERFUiAmJiBwYXRoRXhpc3RzU3luYyhwcm9jZXNzLmVudi5ZQVJOX0NBQ0hFX0ZPTERFUikpXG5cdHtcblx0XHRyZXR1cm4gam9pbihwcm9jZXNzLmVudi5ZQVJOX0NBQ0hFX0ZPTERFUiwgJ195cHgnKVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkoKVxue1xuXHRyZXR1cm4gbmV3IEJsdWViaXJkPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT5cblx0e1xuXHRcdHRtcERpcih7XG5cdFx0XHR1bnNhZmVDbGVhbnVwOiBmYWxzZSxcblx0XHRcdHByZWZpeDogJ3lweF8nLFxuXHRcdFx0ZGlyOiBnZXRDYWNoZURpcigpLFxuXHRcdH0sIChlcnJvciwgZGlyUGF0aCkgPT5cblx0XHR7XG5cdFx0XHRpZiAoZXJyb3IpXG5cdFx0XHR7XG5cdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHJlc29sdmUoZGlyUGF0aCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBuZXdUZW1wb3JhcnkoKVxue1xuXHRsZXQgdG1wRGlyID0gYXdhaXQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KClcblxuXHRyZXR1cm4ge1xuXHRcdGdldCB0bXBEaXIoKVxuXHRcdHtcblx0XHRcdHJldHVybiB0bXBEaXI7XG5cdFx0fSxcblx0XHRyZW1vdmUoKVxuXHRcdHtcblx0XHRcdHJldHVybiByZW1vdmUodG1wRGlyKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5XG4iXX0=