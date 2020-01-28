Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCommand = findCommand;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _fsExtra = require("fs-extra");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function findCommand(name, cwd) {
  let cp = _crossSpawnExtra.default.sync('yarn', ['bin', name].filter(v => v != null), {
    stripAnsi: true,
    cwd
  });

  let bin = cp.stdout.toString().replace(/^\s+|\s+$/g, '');

  if (bin && (0, _fsExtra.pathExistsSync)(bin)) {
    return bin;
  }
}

var _default = findCommand;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmRDb21tYW5kLnRzIl0sIm5hbWVzIjpbImZpbmRDb21tYW5kIiwibmFtZSIsImN3ZCIsImNwIiwiY3Jvc3NTcGF3bkV4dHJhIiwic3luYyIsImZpbHRlciIsInYiLCJzdHJpcEFuc2kiLCJiaW4iLCJzdGRvdXQiLCJ0b1N0cmluZyIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBRU8sZUFBZUEsV0FBZixDQUEyQkMsSUFBM0IsRUFBeUNDLEdBQXpDLEVBQ1A7QUFDQyxNQUFJQyxFQUFFLEdBQUdDLHlCQUFnQkMsSUFBaEIsQ0FBcUIsTUFBckIsRUFBNkIsQ0FDckMsS0FEcUMsRUFFckNKLElBRnFDLEVBR3BDSyxNQUhvQyxDQUc3QkMsQ0FBQyxJQUFJQSxDQUFDLElBQUksSUFIbUIsQ0FBN0IsRUFHaUI7QUFDekJDLElBQUFBLFNBQVMsRUFBRSxJQURjO0FBRXpCTixJQUFBQTtBQUZ5QixHQUhqQixDQUFUOztBQVFBLE1BQUlPLEdBQUcsR0FBR04sRUFBRSxDQUFDTyxNQUFILENBQVVDLFFBQVYsR0FDUkMsT0FEUSxDQUNBLFlBREEsRUFDYyxFQURkLENBQVY7O0FBR0EsTUFBSUgsR0FBRyxJQUFJLDZCQUFlQSxHQUFmLENBQVgsRUFDQTtBQUNDLFdBQU9BLEdBQVA7QUFDQTtBQUNEOztlQUVjVCxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyb3NzU3Bhd25FeHRyYSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgeyBwYXRoRXhpc3RzU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmRDb21tYW5kKG5hbWU6IHN0cmluZywgY3dkOiBzdHJpbmcpXG57XG5cdGxldCBjcCA9IGNyb3NzU3Bhd25FeHRyYS5zeW5jKCd5YXJuJywgW1xuXHRcdCdiaW4nLFxuXHRcdG5hbWUsXG5cdF0uZmlsdGVyKHYgPT4gdiAhPSBudWxsKSwge1xuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0XHRjd2QsXG5cdH0pO1xuXG5cdGxldCBiaW4gPSBjcC5zdGRvdXQudG9TdHJpbmcoKVxuXHRcdC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcblx0O1xuXHRpZiAoYmluICYmIHBhdGhFeGlzdHNTeW5jKGJpbikpXG5cdHtcblx0XHRyZXR1cm4gYmluO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbmRDb21tYW5kXG4iXX0=