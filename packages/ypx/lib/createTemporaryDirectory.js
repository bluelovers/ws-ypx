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
      stripAnsi: true,
      env: process.env
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
    const tmpdir = getCacheDir();
    (0, _tmp.dir)({
      unsafeCleanup: false,
      prefix: 'ypx_',
      dir: tmpdir,
      tmpdir
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeS50cyJdLCJuYW1lcyI6WyJnZXRDYWNoZURpciIsImNwIiwic3RyaXBBbnNpIiwiZW52IiwicHJvY2VzcyIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJzdGRvdXQiLCJ0b1N0cmluZyIsInRlbXBGb2xkZXIiLCJlIiwiWUFSTl9DQUNIRV9GT0xERVIiLCJjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJyZWplY3QiLCJ0bXBkaXIiLCJ1bnNhZmVDbGVhbnVwIiwicHJlZml4IiwiZGlyIiwiZXJyb3IiLCJkaXJQYXRoIiwibmV3VGVtcG9yYXJ5IiwidG1wRGlyIiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsV0FBVCxHQUNQO0FBQ0MsTUFDQTtBQUNDLFFBQUlDLEVBQUUsR0FBRywyQkFBZ0IsTUFBaEIsRUFBd0IsQ0FDaEMsUUFEZ0MsRUFFaEMsU0FGZ0MsRUFHaEMsUUFIZ0MsQ0FBeEIsRUFJTjtBQUNGQyxNQUFBQSxTQUFTLEVBQUUsSUFEVDtBQUVGQyxNQUFBQSxHQUFHLEVBQUVDLE9BQU8sQ0FBQ0Q7QUFGWCxLQUpNLENBQVQ7QUFTQSxRQUFJRSxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNDLEtBQUwsQ0FBV04sRUFBRSxDQUFDTyxNQUFILENBQVVDLFFBQVYsRUFBWCxFQUFpQ0osSUFBNUMsQ0FBWDs7QUFFQSxRQUFJQSxJQUFJLENBQUNLLFVBQVQsRUFDQTtBQUNDLGFBQU9MLElBQUksQ0FBQ0ssVUFBWjtBQUNBO0FBQ0QsR0FqQkQsQ0FrQkEsT0FBT0MsQ0FBUCxFQUNBLENBRUM7O0FBRUQsTUFBSVAsT0FBTyxDQUFDRCxHQUFSLENBQVlTLGlCQUFaLElBQWlDLDZCQUFlUixPQUFPLENBQUNELEdBQVIsQ0FBWVMsaUJBQTNCLENBQXJDLEVBQ0E7QUFDQyxXQUFPLGdCQUFLUixPQUFPLENBQUNELEdBQVIsQ0FBWVMsaUJBQWpCLEVBQW9DLE1BQXBDLENBQVA7QUFDQTtBQUNEOztBQUVNLFNBQVNDLHdCQUFULEdBQ1A7QUFDQyxTQUFPLElBQUlDLGlCQUFKLENBQXFCLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUM1QjtBQUNDLFVBQU1DLE1BQU0sR0FBR2pCLFdBQVcsRUFBMUI7QUFFQSxrQkFBTztBQUNOa0IsTUFBQUEsYUFBYSxFQUFFLEtBRFQ7QUFFTkMsTUFBQUEsTUFBTSxFQUFFLE1BRkY7QUFHTkMsTUFBQUEsR0FBRyxFQUFFSCxNQUhDO0FBS05BLE1BQUFBO0FBTE0sS0FBUCxFQU1HLENBQUNJLEtBQUQsRUFBUUMsT0FBUixLQUNIO0FBQ0MsVUFBSUQsS0FBSixFQUNBO0FBQ0NMLFFBQUFBLE1BQU0sQ0FBQ0ssS0FBRCxDQUFOO0FBQ0EsT0FIRCxNQUtBO0FBQ0NOLFFBQUFBLE9BQU8sQ0FBQ08sT0FBRCxDQUFQO0FBQ0E7QUFDRCxLQWhCRDtBQWlCQSxHQXJCTSxDQUFQO0FBc0JBOztBQUVNLGVBQWVDLFlBQWYsR0FDUDtBQUNDLE1BQUlDLE1BQU0sR0FBRyxNQUFNWCx3QkFBd0IsRUFBM0M7QUFFQSxTQUFPO0FBQ04sUUFBSVcsTUFBSixHQUNBO0FBQ0MsYUFBT0EsTUFBUDtBQUNBLEtBSks7O0FBS05DLElBQUFBLE1BQU0sR0FDTjtBQUNDLGFBQU8scUJBQU9ELE1BQVAsQ0FBUDtBQUNBOztBQVJLLEdBQVA7QUFVQTs7ZUFFY1gsd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMjguXG4gKi9cbmltcG9ydCB7IGRpciBhcyB0bXBEaXIgfSBmcm9tICd0bXAnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHN5bmMgYXMgY3Jvc3NTcGF3bkV4dHJhIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IHsgcGF0aEV4aXN0c1N5bmMsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlRGlyKCk6IHN0cmluZ1xue1xuXHR0cnlcblx0e1xuXHRcdGxldCBjcCA9IGNyb3NzU3Bhd25FeHRyYSgneWFybicsIFtcblx0XHRcdCdjb25maWcnLFxuXHRcdFx0J2N1cnJlbnQnLFxuXHRcdFx0Jy0tanNvbicsXG5cdFx0XSwge1xuXHRcdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdFx0ZW52OiBwcm9jZXNzLmVudixcblx0XHR9KTtcblxuXHRcdGxldCBkYXRhID0gSlNPTi5wYXJzZShKU09OLnBhcnNlKGNwLnN0ZG91dC50b1N0cmluZygpKS5kYXRhKTtcblxuXHRcdGlmIChkYXRhLnRlbXBGb2xkZXIpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGRhdGEudGVtcEZvbGRlclxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXG5cdH1cblxuXHRpZiAocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIgJiYgcGF0aEV4aXN0c1N5bmMocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIpKVxuXHR7XG5cdFx0cmV0dXJuIGpvaW4ocHJvY2Vzcy5lbnYuWUFSTl9DQUNIRV9GT0xERVIsICdfeXB4Jylcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5KClcbntcblx0cmV0dXJuIG5ldyBCbHVlYmlyZDxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHRjb25zdCB0bXBkaXIgPSBnZXRDYWNoZURpcigpO1xuXG5cdFx0dG1wRGlyKHtcblx0XHRcdHVuc2FmZUNsZWFudXA6IGZhbHNlLFxuXHRcdFx0cHJlZml4OiAneXB4XycsXG5cdFx0XHRkaXI6IHRtcGRpcixcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHRtcGRpcixcblx0XHR9LCAoZXJyb3IsIGRpclBhdGgpID0+XG5cdFx0e1xuXHRcdFx0aWYgKGVycm9yKVxuXHRcdFx0e1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZXNvbHZlKGRpclBhdGgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbmV3VGVtcG9yYXJ5KClcbntcblx0bGV0IHRtcERpciA9IGF3YWl0IGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSgpO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0IHRtcERpcigpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHRtcERpcjtcblx0XHR9LFxuXHRcdHJlbW92ZSgpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlbW92ZSh0bXBEaXIpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnlcbiJdfQ==