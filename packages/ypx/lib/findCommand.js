Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCommand = findCommand;
exports.findCommand2 = findCommand2;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _fsExtra = require("fs-extra");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function findCommand(name, cwd) {
  let cp = await _crossSpawnExtra.default.sync('yarn', ['bin', name].filter(v => v != null), {
    stripAnsi: true,
    cwd
  });
  let bin = cp.stdout.toString().replace(/^\s+|\s+$/g, '');

  if (bin && (0, _fsExtra.pathExistsSync)(bin)) {
    return bin;
  }
}

async function findCommand2(name, cwd) {
  try {
    let file = require.resolve(name + '/package.json', {
      paths: [cwd]
    });

    let json = await (0, _fsExtra.readJSON)(file);
    let dir = (0, _path.dirname)(file);

    if (json.bin) {
      let bin;

      if (typeof json.bin === 'string') {
        bin = json.bin;
      } else {
        bin = Object.values(json.bin)[0];
      }
    }
  } catch (e) {}
}

var _default = findCommand;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmRDb21tYW5kLnRzIl0sIm5hbWVzIjpbImZpbmRDb21tYW5kIiwibmFtZSIsImN3ZCIsImNwIiwiY3Jvc3NTcGF3bkV4dHJhIiwic3luYyIsImZpbHRlciIsInYiLCJzdHJpcEFuc2kiLCJiaW4iLCJzdGRvdXQiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJmaW5kQ29tbWFuZDIiLCJmaWxlIiwicmVxdWlyZSIsInJlc29sdmUiLCJwYXRocyIsImpzb24iLCJkaXIiLCJPYmplY3QiLCJ2YWx1ZXMiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7QUFFTyxlQUFlQSxXQUFmLENBQTJCQyxJQUEzQixFQUF5Q0MsR0FBekMsRUFDUDtBQUNDLE1BQUlDLEVBQUUsR0FBRyxNQUFNQyx5QkFBZ0JDLElBQWhCLENBQXFCLE1BQXJCLEVBQTZCLENBQzNDLEtBRDJDLEVBRTNDSixJQUYyQyxFQUcxQ0ssTUFIMEMsQ0FHbkNDLENBQUMsSUFBSUEsQ0FBQyxJQUFJLElBSHlCLENBQTdCLEVBR1c7QUFDekJDLElBQUFBLFNBQVMsRUFBRSxJQURjO0FBRXpCTixJQUFBQTtBQUZ5QixHQUhYLENBQWY7QUFRQSxNQUFJTyxHQUFHLEdBQUdOLEVBQUUsQ0FBQ08sTUFBSCxDQUFVQyxRQUFWLEdBQ1JDLE9BRFEsQ0FDQSxZQURBLEVBQ2MsRUFEZCxDQUFWOztBQUdBLE1BQUlILEdBQUcsSUFBSSw2QkFBZUEsR0FBZixDQUFYLEVBQ0E7QUFDQyxXQUFPQSxHQUFQO0FBQ0E7QUFDRDs7QUFFTSxlQUFlSSxZQUFmLENBQTRCWixJQUE1QixFQUEwQ0MsR0FBMUMsRUFDUDtBQUNDLE1BQ0E7QUFDQyxRQUFJWSxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQmYsSUFBSSxHQUFHLGVBQXZCLEVBQXdDO0FBQ2xEZ0IsTUFBQUEsS0FBSyxFQUFFLENBQUNmLEdBQUQ7QUFEMkMsS0FBeEMsQ0FBWDs7QUFJQSxRQUFJZ0IsSUFBSSxHQUFHLE1BQU0sdUJBQVNKLElBQVQsQ0FBakI7QUFDQSxRQUFJSyxHQUFHLEdBQUcsbUJBQVFMLElBQVIsQ0FBVjs7QUFFQSxRQUFJSSxJQUFJLENBQUNULEdBQVQsRUFDQTtBQUNDLFVBQUlBLEdBQUo7O0FBQ0EsVUFBSSxPQUFPUyxJQUFJLENBQUNULEdBQVosS0FBb0IsUUFBeEIsRUFDQTtBQUNDQSxRQUFBQSxHQUFHLEdBQUdTLElBQUksQ0FBQ1QsR0FBWDtBQUNBLE9BSEQsTUFLQTtBQUNDQSxRQUFBQSxHQUFHLEdBQUdXLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjSCxJQUFJLENBQUNULEdBQW5CLEVBQXdCLENBQXhCLENBQU47QUFDQTtBQUdEO0FBQ0QsR0F2QkQsQ0F3QkEsT0FBT2EsQ0FBUCxFQUNBLENBRUM7QUFDRDs7ZUFFY3RCLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3Jvc3NTcGF3bkV4dHJhIGZyb20gJ2Nyb3NzLXNwYXduLWV4dHJhJztcbmltcG9ydCB7IHBhdGhFeGlzdHNTeW5jLCByZWFkSlNPTiB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBiaW5FeGlzdHMgZnJvbSAnYmluLWV4aXN0cyc7XG5pbXBvcnQgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5kQ29tbWFuZChuYW1lOiBzdHJpbmcsIGN3ZDogc3RyaW5nKVxue1xuXHRsZXQgY3AgPSBhd2FpdCBjcm9zc1NwYXduRXh0cmEuc3luYygneWFybicsIFtcblx0XHQnYmluJyxcblx0XHRuYW1lLFxuXHRdLmZpbHRlcih2ID0+IHYgIT0gbnVsbCksIHtcblx0XHRzdHJpcEFuc2k6IHRydWUsXG5cdFx0Y3dkLFxuXHR9KTtcblxuXHRsZXQgYmluID0gY3Auc3Rkb3V0LnRvU3RyaW5nKClcblx0XHQucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG5cdDtcblx0aWYgKGJpbiAmJiBwYXRoRXhpc3RzU3luYyhiaW4pKVxuXHR7XG5cdFx0cmV0dXJuIGJpbjtcblx0fVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZENvbW1hbmQyKG5hbWU6IHN0cmluZywgY3dkOiBzdHJpbmcpXG57XG5cdHRyeVxuXHR7XG5cdFx0bGV0IGZpbGUgPSByZXF1aXJlLnJlc29sdmUobmFtZSArICcvcGFja2FnZS5qc29uJywge1xuXHRcdFx0cGF0aHM6IFtjd2RdXG5cdFx0fSk7XG5cblx0XHRsZXQganNvbiA9IGF3YWl0IHJlYWRKU09OKGZpbGUpO1xuXHRcdGxldCBkaXIgPSBkaXJuYW1lKGZpbGUpO1xuXG5cdFx0aWYgKGpzb24uYmluKVxuXHRcdHtcblx0XHRcdGxldCBiaW46IHN0cmluZztcblx0XHRcdGlmICh0eXBlb2YganNvbi5iaW4gPT09ICdzdHJpbmcnKVxuXHRcdFx0e1xuXHRcdFx0XHRiaW4gPSBqc29uLmJpbjtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0YmluID0gT2JqZWN0LnZhbHVlcyhqc29uLmJpbilbMF0gYXMgc3RyaW5nXG5cdFx0XHR9XG5cblxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluZENvbW1hbmRcbiJdfQ==