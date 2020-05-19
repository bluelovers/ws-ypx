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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeS50cyJdLCJuYW1lcyI6WyJnZXRDYWNoZURpciIsImNwIiwic3RyaXBBbnNpIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInN0ZG91dCIsInRvU3RyaW5nIiwidGVtcEZvbGRlciIsImUiLCJwcm9jZXNzIiwiZW52IiwiWUFSTl9DQUNIRV9GT0xERVIiLCJjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkiLCJCbHVlYmlyZCIsInJlc29sdmUiLCJyZWplY3QiLCJ0bXBkaXIiLCJ1bnNhZmVDbGVhbnVwIiwicHJlZml4IiwiZGlyIiwiZXJyb3IiLCJkaXJQYXRoIiwibmV3VGVtcG9yYXJ5IiwidG1wRGlyIiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsV0FBVCxHQUNQO0FBQ0MsTUFDQTtBQUNDLFFBQUlDLEVBQUUsR0FBRywyQkFBZ0IsTUFBaEIsRUFBd0IsQ0FDaEMsUUFEZ0MsRUFFaEMsU0FGZ0MsRUFHaEMsUUFIZ0MsQ0FBeEIsRUFJTjtBQUNGQyxNQUFBQSxTQUFTLEVBQUU7QUFEVCxLQUpNLENBQVQ7QUFRQSxRQUFJQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNDLEtBQUwsQ0FBV0osRUFBRSxDQUFDSyxNQUFILENBQVVDLFFBQVYsRUFBWCxFQUFpQ0osSUFBNUMsQ0FBWDs7QUFFQSxRQUFJQSxJQUFJLENBQUNLLFVBQVQsRUFDQTtBQUNDLGFBQU9MLElBQUksQ0FBQ0ssVUFBWjtBQUNBO0FBQ0QsR0FoQkQsQ0FpQkEsT0FBT0MsQ0FBUCxFQUNBLENBRUM7O0FBRUQsTUFBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGlCQUFaLElBQWlDLDZCQUFlRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQTNCLENBQXJDLEVBQ0E7QUFDQyxXQUFPLGdCQUFLRixPQUFPLENBQUNDLEdBQVIsQ0FBWUMsaUJBQWpCLEVBQW9DLE1BQXBDLENBQVA7QUFDQTtBQUNEOztBQUVNLFNBQVNDLHdCQUFULEdBQ1A7QUFDQyxTQUFPLElBQUlDLGlCQUFKLENBQXFCLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUM1QjtBQUNDLFVBQU1DLE1BQU0sR0FBR2pCLFdBQVcsRUFBMUI7QUFFQSxrQkFBTztBQUNOa0IsTUFBQUEsYUFBYSxFQUFFLEtBRFQ7QUFFTkMsTUFBQUEsTUFBTSxFQUFFLE1BRkY7QUFHTkMsTUFBQUEsR0FBRyxFQUFFSCxNQUhDO0FBS05BLE1BQUFBO0FBTE0sS0FBUCxFQU1HLENBQUNJLEtBQUQsRUFBUUMsT0FBUixLQUNIO0FBQ0MsVUFBSUQsS0FBSixFQUNBO0FBQ0NMLFFBQUFBLE1BQU0sQ0FBQ0ssS0FBRCxDQUFOO0FBQ0EsT0FIRCxNQUtBO0FBQ0NOLFFBQUFBLE9BQU8sQ0FBQ08sT0FBRCxDQUFQO0FBQ0E7QUFDRCxLQWhCRDtBQWlCQSxHQXJCTSxDQUFQO0FBc0JBOztBQUVNLGVBQWVDLFlBQWYsR0FDUDtBQUNDLE1BQUlDLE1BQU0sR0FBRyxNQUFNWCx3QkFBd0IsRUFBM0M7QUFFQSxTQUFPO0FBQ04sUUFBSVcsTUFBSixHQUNBO0FBQ0MsYUFBT0EsTUFBUDtBQUNBLEtBSks7O0FBS05DLElBQUFBLE1BQU0sR0FDTjtBQUNDLGFBQU8scUJBQU9ELE1BQVAsQ0FBUDtBQUNBOztBQVJLLEdBQVA7QUFVQTs7ZUFFY1gsd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMjguXG4gKi9cbmltcG9ydCB7IGRpciBhcyB0bXBEaXIgfSBmcm9tICd0bXAnO1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHN5bmMgYXMgY3Jvc3NTcGF3bkV4dHJhIH0gZnJvbSAnY3Jvc3Mtc3Bhd24tZXh0cmEnO1xuaW1wb3J0IHsgcGF0aEV4aXN0c1N5bmMsIHJlbW92ZSB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlRGlyKCk6IHN0cmluZ1xue1xuXHR0cnlcblx0e1xuXHRcdGxldCBjcCA9IGNyb3NzU3Bhd25FeHRyYSgneWFybicsIFtcblx0XHRcdCdjb25maWcnLFxuXHRcdFx0J2N1cnJlbnQnLFxuXHRcdFx0Jy0tanNvbicsXG5cdFx0XSwge1xuXHRcdFx0c3RyaXBBbnNpOiB0cnVlXG5cdFx0fSk7XG5cblx0XHRsZXQgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5wYXJzZShjcC5zdGRvdXQudG9TdHJpbmcoKSkuZGF0YSk7XG5cblx0XHRpZiAoZGF0YS50ZW1wRm9sZGVyKVxuXHRcdHtcblx0XHRcdHJldHVybiBkYXRhLnRlbXBGb2xkZXJcblx0XHR9XG5cdH1cblx0Y2F0Y2ggKGUpXG5cdHtcblxuXHR9XG5cblx0aWYgKHByb2Nlc3MuZW52LllBUk5fQ0FDSEVfRk9MREVSICYmIHBhdGhFeGlzdHNTeW5jKHByb2Nlc3MuZW52LllBUk5fQ0FDSEVfRk9MREVSKSlcblx0e1xuXHRcdHJldHVybiBqb2luKHByb2Nlc3MuZW52LllBUk5fQ0FDSEVfRk9MREVSLCAnX3lweCcpXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBvcmFyeURpcmVjdG9yeSgpXG57XG5cdHJldHVybiBuZXcgQmx1ZWJpcmQ8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHR7XG5cdFx0Y29uc3QgdG1wZGlyID0gZ2V0Q2FjaGVEaXIoKTtcblxuXHRcdHRtcERpcih7XG5cdFx0XHR1bnNhZmVDbGVhbnVwOiBmYWxzZSxcblx0XHRcdHByZWZpeDogJ3lweF8nLFxuXHRcdFx0ZGlyOiB0bXBkaXIsXG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHR0bXBkaXIsXG5cdFx0fSwgKGVycm9yLCBkaXJQYXRoKSA9PlxuXHRcdHtcblx0XHRcdGlmIChlcnJvcilcblx0XHRcdHtcblx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0cmVzb2x2ZShkaXJQYXRoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5ld1RlbXBvcmFyeSgpXG57XG5cdGxldCB0bXBEaXIgPSBhd2FpdCBjcmVhdGVUZW1wb3JhcnlEaXJlY3RvcnkoKTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldCB0bXBEaXIoKVxuXHRcdHtcblx0XHRcdHJldHVybiB0bXBEaXI7XG5cdFx0fSxcblx0XHRyZW1vdmUoKVxuXHRcdHtcblx0XHRcdHJldHVybiByZW1vdmUodG1wRGlyKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGVtcG9yYXJ5RGlyZWN0b3J5XG4iXX0=